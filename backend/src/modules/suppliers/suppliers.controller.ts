import { Response, NextFunction } from 'express';
import { suppliersService } from './suppliers.service';
import { AuthenticatedRequest } from '../../types';
import { sendSuccess } from '../../utils/response';
import { parsePagination, buildPaginationMeta } from '../../utils/response';

export class SuppliersController {
  /**
   * POST /api/suppliers/enquiry/create
   */
  async createEnquiry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const enquiry = await suppliersService.createEnquiry(req.body, req.user!.userId);
      sendSuccess(res, enquiry, 'Enquiry created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/suppliers/enquiry/list
   */
  async listEnquiries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const { search, status, supplierId } = req.query as any;
      const { enquiries, total } = await suppliersService.listEnquiries(pagination, { search, status, supplierId });
      const meta = buildPaginationMeta(total, pagination);
      sendSuccess(res, enquiries, undefined, 200, meta);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/suppliers/quotation/add
   */
  async addQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const quotation = await suppliersService.addQuotation(req.body, req.user!.userId);
      sendSuccess(res, quotation, 'Quotation added successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/suppliers/quotation/list
   */
  async listQuotations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const { search, status, supplierId } = req.query as any;
      const { quotations, total } = await suppliersService.listQuotations(pagination, { search, status, supplierId });
      const meta = buildPaginationMeta(total, pagination);
      sendSuccess(res, quotations, undefined, 200, meta);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/suppliers/list
   */
  async listSuppliers(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const suppliers = await suppliersService.listSuppliers();
      sendSuccess(res, suppliers);
    } catch (err) {
      next(err);
    }
  }
}

export const suppliersController = new SuppliersController();
