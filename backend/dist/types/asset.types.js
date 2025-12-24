"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realEstateSchema = void 0;
const zod_1 = require("zod");
exports.realEstateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    value: zod_1.z.number().positive(),
    currency: zod_1.z.string().default('USD'),
    location: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    surface: zod_1.z.number().positive(),
    yearBuilt: zod_1.z.number().min(1800).max(new Date().getFullYear()).default(new Date().getFullYear()),
    propertyType: zod_1.z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OTHER']),
    rooms: zod_1.z.number().optional(),
    bathrooms: zod_1.z.number().optional(),
    hasParking: zod_1.z.boolean().default(false),
    hasGarden: zod_1.z.boolean().default(false),
});
