import prisma from '../../config/database';
import { PaginationParams } from '../../types';
import { generateSequenceNumber } from '../../utils/sequence';
import { writeAuditLog } from '../../utils/auditLogger';
import { CustomerEnquiryStatus, CustomerQuotationStatus, CustomerOrderStatus, Prisma } from '@prisma/client';
import { CustomerEnquiryInput, GenerateQuotationInput, ConfirmOrderInput } from './sales.validator';

export class SalesService {
  // =========================================================================
  // CUSTOMER ENQUIRY
  // =========================================================================

  async createCustomerEnquiry(input: CustomerEnquiryInput, userId: string) {
    const enquiryNo = await generateSequenceNumber('CE', 'customerEnquiry');

    const enquiry = await prisma.customerEnquiry.create({
      data: {
        enquiryNo,
        customerName: input.customerName,
        customerEmail: input.customerEmail || null,
        customerPhone: input.customerPhone || null,
        productName: input.productName,
        quantity: input.quantity,
        status: CustomerEnquiryStatus.NEW,
        remarks: input.remarks,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    await writeAuditLog({
      actorId: userId,
      action: 'CREATE_CUSTOMER_ENQUIRY',
      entityType: 'CustomerEnquiry',
      entityId: enquiry.id,
      metadata: { enquiryNo, customerName: input.customerName, productName: input.productName },
    });

    return enquiry;
  }

  // =========================================================================
  // QUOTATION GENERATION
  // =========================================================================

  async generateQuotation(input: GenerateQuotationInput, userId: string) {
    const quotationNo = await generateSequenceNumber('CQ', 'customerQuotation');
    const totalAmount = input.quantity * input.unitPrice;

    // Determine version
    let version = 1;
    if (input.enquiryId) {
      const existing = await prisma.customerQuotation.count({
        where: { enquiryId: input.enquiryId },
      });
      version = existing + 1;
    }

    const quotation = await prisma.customerQuotation.create({
      data: {
        quotationNo,
        enquiryId: input.enquiryId || null,
        customerName: input.customerName,
        productName: input.productName,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        totalAmount,
        version,
        status: CustomerQuotationStatus.DRAFT,
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
        remarks: input.remarks,
        createdById: userId,
        items: input.items && input.items.length > 0 ? {
          create: input.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        } : {
          create: [{
            productName: input.productName,
            quantity: input.quantity,
            unitPrice: input.unitPrice,
            totalPrice: totalAmount,
          }],
        },
      },
      include: {
        enquiry: { select: { id: true, enquiryNo: true } },
        items: true,
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    // Update enquiry status if linked
    if (input.enquiryId) {
      await prisma.customerEnquiry.update({
        where: { id: input.enquiryId },
        data: { status: CustomerEnquiryStatus.QUOTED },
      });
    }

    await writeAuditLog({
      actorId: userId,
      action: 'GENERATE_QUOTATION',
      entityType: 'CustomerQuotation',
      entityId: quotation.id,
      metadata: { quotationNo, customerName: input.customerName, totalAmount },
    });

    return quotation;
  }

  // =========================================================================
  // ORDER CONFIRMATION
  // =========================================================================

  async confirmOrder(input: ConfirmOrderInput, userId: string) {
    const orderNo = await generateSequenceNumber('ORD', 'customerOrder');

    const order = await prisma.customerOrder.create({
      data: {
        orderNo,
        quotationId: input.quotationId || null,
        customerName: input.customerName,
        customerEmail: input.customerEmail || null,
        customerPhone: input.customerPhone || null,
        productName: input.productName,
        quantity: input.quantity,
        totalAmount: input.totalAmount,
        status: CustomerOrderStatus.CONFIRMED,
        confirmedDate: new Date(),
        expectedDelivery: input.expectedDelivery ? new Date(input.expectedDelivery) : null,
        remarks: input.remarks,
        createdById: userId,
      },
      include: {
        quotation: { select: { id: true, quotationNo: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    // Update quotation status if linked
    if (input.quotationId) {
      await prisma.customerQuotation.update({
        where: { id: input.quotationId },
        data: { status: CustomerQuotationStatus.ACCEPTED },
      });
    }

    await writeAuditLog({
      actorId: userId,
      action: 'CONFIRM_ORDER',
      entityType: 'CustomerOrder',
      entityId: order.id,
      metadata: { orderNo, customerName: input.customerName, totalAmount: input.totalAmount },
    });

    return order;
  }

  // =========================================================================
  // ORDER LISTING
  // =========================================================================

  async listOrders(pagination: PaginationParams, filters: { search?: string; status?: string }) {
    const where: Prisma.CustomerOrderWhereInput = {};

    if (filters.status) {
      where.status = filters.status as CustomerOrderStatus;
    }
    if (filters.search) {
      where.OR = [
        { orderNo: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { productName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.customerOrder.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          quotation: { select: { id: true, quotationNo: true } },
          createdBy: { select: { id: true, fullName: true } },
        },
      }),
      prisma.customerOrder.count({ where }),
    ]);

    return { orders, total };
  }
}

export const salesService = new SalesService();
