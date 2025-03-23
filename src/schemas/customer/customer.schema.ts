import { z } from "zod";

const addressSchema = z.object({
  postalCode: z.number().nullable().optional(),
  street: z.string().nullable().optional(),
  complement: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  city: z.string(),
  state: z.string(),
  region: z.string(),
  country: z.string(),
});

const statusSchema = z.union([
  z.literal("ACTIVE"),
  z.literal("BLOCKED"),
  z.literal("INACTIVE"),
]);

export const customerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string().optional(),
  email: z.string().email().optional(),
  document: z.string().optional(),
  phone: z.string(),
  status: statusSchema,
  address: addressSchema,
});
