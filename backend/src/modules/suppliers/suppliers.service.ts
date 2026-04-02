import prisma from '../../config/database';
import { PaginationParams } from '../../types';
import { generateSequenceNumber } from '../../utils/sequence';
import { writeAuditLog } from '../../utils/auditLogger';
import { NotFoundError } from '../../utils/errors';
import { CreateEnquiryInput, AddQuotationInput } from './suppliers.validator';
import { EnquiryStatus, QuotationStatus, Prisma } from '@prisma/client';

export class SuppliersService {
  // =========================================================================
  // ENQUIRIES
  // =========================================================================

  async createEnquiry(input: CreateEnquiryInput, userId: string) {
    const enquiryNo = await generateSequenceNumber('ENQ', 'supplierEnquiry');

    const enquiry = await prisma.supplierEnquiry.create({
      data: {
        enquiryNo,
        supplierId: input.supplierId,
        status: EnquiryStatus.DRAFT,
        remarks: input.remarks,
        createdById: userId,
        items: {
          create: input.items.map(item => ({
            materialId: item.materialId,
            quantity: item.quantity,
            unit: item.unit || 'pcs',
            remarks: item.remarks,
          })),
        },
      },
      include: {
        supplier: { select: { id: true, name: true } },
        items: {
          include: { material: { select: { id: true, name: true, code: true, unit: true } } },
        },
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    await writeAuditLog({
      actorId: userId,
      action: 'CREATE_ENQUIRY',
      entityType: 'SupplierEnquiry',
      entityId: enquiry.id,
      metadata: { enquiryNo, supplierId: input.supplierId, itemCount: input.items.length },
    });

    return enquiry;
  }

  async listEnquiries(
    pagination: PaginationParams,
    filters: { search?: string; status?: string; supplierId?: string },
  ) {
    const where: Prisma.SupplierEnquiryWhereInput = {};

    if (filters.status) {
      where.status = filters.status as EnquiryStatus;
    }
    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }
    if (filters.search) {
      where.OR = [
        { enquiryNo: { contains: filters.search, mode: 'insensitive' } },
        { supplier: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [enquiries, total] = await Promise.all([
      prisma.supplierEnquiry.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: { select: { id: true, name: true } },
          items: {
            include: { material: { select: { id: true, name: true, code: true, unit: true } } },
          },
          createdBy: { select: { id: true, fullName: true } },
        },
      }),
      prisma.supplierEnquiry.count({ where }),
    ]);

    return { enquiries, total };
  }

  // =========================================================================
  // QUOTATIONS
  // =========================================================================

  async addQuotation(input: AddQuotationInput, userId: string) {
    const quotationNo = await generateSequenceNumber('SQ', 'supplierQuotation');
    const totalAmount = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const quotation = await prisma.supplierQuotation.create({
      data: {
        quotationNo,
        supplierId: input.supplierId,
        enquiryId: input.enquiryId || null,
        status: QuotationStatus.RECEIVED,
        totalAmount,
        leadTimeDays: input.leadTimeDays,
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
        remarks: input.remarks,
        createdById: userId,
        items: {
          create: input.items.map(item => ({
            materialId: item.materialId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit || 'pcs',
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        supplier: { select: { id: true, name: true } },
        enquiry: { select: { id: true, enquiryNo: true } },
        items: {
          include: { material: { select: { id: true, name: true, code: true, unit: true } } },
        },
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    // If linked to an enquiry, update enquiry status
    if (input.enquiryId) {
      await prisma.supplierEnquiry.update({
        where: { id: input.enquiryId },
        data: { status: EnquiryStatus.RESPONDED, responseDate: new Date() },
      });
    }

    await writeAuditLog({
      actorId: userId,
      action: 'ADD_QUOTATION',
      entityType: 'SupplierQuotation',
      entityId: quotation.id,
      metadata: { quotationNo, supplierId: input.supplierId, totalAmount },
    });

    return quotation;
  }

  async listQuotations(
    pagination: PaginationParams,
    filters: { search?: string; status?: string; supplierId?: string },
  ) {
    const where: Prisma.SupplierQuotationWhereInput = {};

    if (filters.status) {
      where.status = filters.status as QuotationStatus;
    }
    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }
    if (filters.search) {
      where.OR = [
        { quotationNo: { contains: filters.search, mode: 'insensitive' } },
        { supplier: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [quotations, total] = await Promise.all([
      prisma.supplierQuotation.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: { select: { id: true, name: true } },
          enquiry: { select: { id: true, enquiryNo: true } },
          items: {
            include: { material: { select: { id: true, name: true, code: true, unit: true } } },
          },
          createdBy: { select: { id: true, fullName: true } },
        },
      }),
      prisma.supplierQuotation.count({ where }),
    ]);

    return { quotations, total };
  }

  // =========================================================================
  // SUPPLIER CRUD (supporting)
  // =========================================================================

  async listSuppliers() {
    return prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, contactPerson: true, email: true, phone: true, rating: true },
    });
  }
}

export const suppliersService = new SuppliersService();
