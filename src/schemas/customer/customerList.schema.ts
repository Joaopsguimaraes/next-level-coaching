import { z } from 'zod'

export const customerListSchema = z.array(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    status: z.union([z.literal('ACTIVE'), z.literal('BLOCKED'), z.literal('INACTIVE')]),
    address: z.object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
    }),
  }),
)
