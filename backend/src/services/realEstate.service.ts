import { PrismaClient, RealEstate } from '@prisma/client';
import { supabase } from '../services/supabase'; // Assuming this is where it is, or need to fix import path
import { RealEstateInput } from '../types/asset.types';

const prisma = new PrismaClient();

export class RealEstateService {

    async create(userId: string, data: RealEstateInput) {
        return await prisma.realEstate.create({
            data: {
                clerkId: userId,
                name: data.name,
                description: data.description,
                value: data.value,
                currency: data.currency,
                location: data.location,
                address: data.address,
                surface: data.surface,
                yearBuilt: data.yearBuilt,
                propertyType: data.propertyType,
                rooms: data.rooms,
                bathrooms: data.bathrooms,
                hasParking: data.hasParking,
                hasGarden: data.hasGarden,
            },
        });
    }

    async getAll(userId: string) {
        return await prisma.realEstate.findMany({
            where: {
                clerkId: userId
            }
        });
    }

    async getById(userId: string, id: string) {
        return await prisma.realEstate.findFirst({
            where: {
                id,
                clerkId: userId
            }
        });
    }

    async update(userId: string, id: string, data: RealEstateInput) {
        const property = await this.getById(userId, id);

        if (!property) {
            throw new Error("Property not found");
        }

        return await prisma.realEstate.update({
            where: { id },
            data
        });
    }

    async delete(userId: string, id: string) {
        const property = await this.getById(userId, id);

        if (!property) {
            throw new Error("Property not found");
        }

        // Find all associated documents
        const documents = await prisma.assetDocument.findMany({
            where: {
                objectId: id,
                objectType: 'real_estate'
            }
        });

        // Delete documents from Supabase storage
        for (const document of documents) {
            const filePath = new URL(document.url).pathname.split('/').pop();
            if (filePath) {
                const { error } = await supabase.storage
                    .from('documents')
                    .remove([`${userId}/real_estate/${id}/${filePath}`]);

                if (error) {
                    console.error('Error deleting file from Supabase:', error);
                    // We continue executing even if file deletion fails to ensure DB consistency or should we throw?
                    // Following original logic: just log error.
                }
            }
        }

        // Use a transaction to delete both the property and its documents
        await prisma.$transaction(async (tx) => {
            // Delete all associated documents from database
            await tx.assetDocument.deleteMany({
                where: {
                    objectId: id,
                    objectType: 'real_estate'
                }
            });

            // Delete the property
            await tx.realEstate.delete({
                where: { id }
            });
        });

        return { message: "Property and associated documents deleted successfully" };
    }
}
