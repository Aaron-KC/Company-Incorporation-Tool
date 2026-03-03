import { z } from 'zod'

export const schema = z.object({
  companyName: z.string().min(2, 'Required'),
  noOfShareholders: z.coerce.number().min(1, 'Must be at least 1'),
  totalCapital: z.coerce.number().min(0, 'Must be non-negative'),
})