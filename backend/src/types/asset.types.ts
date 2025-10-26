import { z } from 'zod';

export const realEstateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.number().positive(),
  currency: z.string().default('USD'),
  location: z.string().min(1),
  address: z.string().min(1),
  surface: z.number().positive(),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()).default(new Date().getFullYear()),
  propertyType: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OTHER']),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  hasParking: z.boolean().default(false),
  hasGarden: z.boolean().default(false),
});

export type RealEstateInput = z.infer<typeof realEstateSchema>;