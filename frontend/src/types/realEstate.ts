export enum PropertyType {
    HOUSE = "HOUSE",
    APARTMENT = "APARTMENT",
    LAND = "LAND",
    COMMERCIAL = "COMMERCIAL",
    OTHER = "OTHER"
}

export interface RealEstate {
    id: string;
    clerkId: string;
    name: string;
    description?: string;
    value: number; // backend uses Decimal but serializes to number/string on JSON usually, check serialization
    currency: string;
    location: string;
    address: string;
    surface: number;
    yearBuilt?: number;
    propertyType: PropertyType;
    rooms?: number;
    bathrooms?: number;
    hasParking?: boolean;
    hasGarden?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRealEstateInput {
    name: string;
    description?: string;
    value: number;
    currency?: string;
    location: string;
    address: string;
    surface: number;
    yearBuilt?: number;
    propertyType?: PropertyType;
    rooms?: number;
    bathrooms?: number;
    hasParking?: boolean;
    hasGarden?: boolean;
}

export type UpdateRealEstateInput = Partial<CreateRealEstateInput>;
