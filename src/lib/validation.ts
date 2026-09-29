import { z } from "zod";

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(200),
  vehicleSize: z.enum(["SEDAN", "SUV", "VAN", "MOTORCYCLE", "PICKUP"]),
  vehicleModel: z.string().trim().min(2).max(100),
  serviceType: z.string().trim().min(2).max(100),
  requestedDatetime: z.coerce.date(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const inquirySchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  channel: z.enum(["WEBSITE", "FACEBOOK", "INSTAGRAM", "PHONE"]).default("WEBSITE"),
  message: z.string().trim().min(5).max(1000),
});

export const franchiseLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  contactInfo: z.string().trim().min(5).max(200),
  preferredCity: z.string().trim().min(2).max(100),
  modelInterest: z.enum(["FULL_STUDIO", "EXPRESS_BAY"]),
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(200),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        price: z.number().int().nonnegative(),
        qty: z.number().int().positive().max(50),
      })
    )
    .min(1)
    .max(50),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
});

export const bookingStatusUpdateSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "IN_SERVICE", "COMPLETED", "CANCELLED"])
    .optional(),
  paymentStatus: z
    .enum(["UNPAID", "PAID_DOWNPAYMENT", "PAID", "REFUNDED"])
    .optional(),
});

export const inquiryStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "REPLIED", "RESOLVED"]),
});

export const franchiseLeadStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "DECLINED"]),
});
