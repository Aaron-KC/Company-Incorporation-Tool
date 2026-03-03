import { z } from 'zod'

export const schema = z.object({
  companyName: z.string().min(2, 'Company Name is Required!'),
  noOfShareholders: z.coerce.number().min(1, 'Must be at least 1!'),
  totalCapital: z.coerce.number().min(0, 'Must be non-negative!'),
  shareholders: z.array(z.object({
    firstName: z.string().min(2, 'First Name is Required!'),
    lastName:    z.string().min(2, 'Last Name is Required!'),
    nationality:   z.string().min(2, 'Nationality is Required!'),
  })),
}).refine(
  (data) => data.shareholders.length === Number(data.noOfShareholders),
  { message: 'Shareholders entries must match noOfShareholders', path: ['shareholders'] }
)