import { z } from 'zod';

export const realEstateSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  description: z.string().nullish(),
  value: z.coerce.number().positive("Value must be a positive number"),
  currency: z.string().default('USD'),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  surface: z.coerce.number().positive("Surface must be a positive number"),
  yearBuilt: z.coerce.number().min(1800, "Year built must be after 1800").max(new Date().getFullYear(), "Year built cannot be in the future").default(new Date().getFullYear()),
  propertyType: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OTHER']),
  rooms: z.coerce.number().min(0, "Rooms cannot be negative").nullish(),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative").nullish(),
  hasParking: z.boolean().default(false).nullish(),
  hasGarden: z.boolean().default(false).nullish(),
});

export type RealEstateInput = z.infer<typeof realEstateSchema>;