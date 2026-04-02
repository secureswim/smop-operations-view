import { z } from 'zod';

export const createEnquirySchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  remarks: z.string().optional(),
  items: z.array(z.object({
    materialId: z.string().min(1, 'Material ID is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unit: z.string().optional(),
    remarks: z.string().optional(),
  })).min(1, 'At least one item is required'),
});

export const addQuotationSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  enquiryId: z.string().optional(),
  leadTimeDays: z.number().int().positive().optional(),
  validUntil: z.string().datetime().optional(),
  remarks: z.string().optional(),
  items: z.array(z.object({
    materialId: z.string().min(1, 'Material ID is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().positive('Unit price must be positive'),
    unit: z.string().optional(),
  })).min(1, 'At least one item is required'),
});

export const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  supplierId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type AddQuotationInput = z.infer<typeof addQuotationSchema>;
