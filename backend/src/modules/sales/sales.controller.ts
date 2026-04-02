import { Response, NextFunction } from 'express';
import { salesService } from './sales.service';
import { AuthenticatedRequest } from '../../types';
import { sendSuccess, parsePagination, buildPaginationMeta } from '../../utils/response';

export class SalesController {
  async createEnquiry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const enquiry = await salesService.createCustomerEnquiry(req.body, req.user!.userId);
      sendSuccess(res, enquiry, 'Customer enquiry created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async generateQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const quotation = await salesService.generateQuotation(req.body, req.user!.userId);
      sendSuccess(res, quotation, 'Quotation generated successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async confirmOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await salesService.confirmOrder(req.body, req.user!.userId);
      sendSuccess(res, order, 'Order confirmed successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async listOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const { search, status } = req.query as any;
      const { orders, total } = await salesService.listOrders(pagination, { search, status });
      const meta = buildPaginationMeta(total, pagination);
      sendSuccess(res, orders, undefined, 200, meta);
    } catch (err) {
      next(err);
    }
  }
}

export const salesController = new SalesController();
