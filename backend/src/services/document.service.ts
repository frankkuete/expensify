import { PrismaClient, AssetType } from '@prisma/client';
import { supabase } from '../services/supabase';

const prisma = new PrismaClient();

export class DocumentService {

    async uploadDocument(userId: string, file: Express.Multer.File, assetType: string, objectId: string) {
        // Validate asset type
        if (!Object.values(AssetType).includes(assetType as AssetType)) {
            throw new Error("Invalid asset type");
        }

        // Check if asset exists and belongs to user
        let asset;
        switch (assetType) {
            case 'real_estate':
                asset = await prisma.realEstate.findFirst({
                    where: { id: objectId, clerkId: userId }
                });
                break;
            case 'stock':
                asset = await prisma.stock.findFirst({
                    where: { id: objectId, clerkId: userId }
                });
                break;
            // Add other asset types here as needed
            default:
                // Even if enum matches, if we don't handle it in switch, we might want to check generic or throw
                // For now trusting the enum check above but we need to fetch asset to check ownership
                throw new Error("Asset type not supported for document association");
        }

        if (!asset) {
            throw new Error("Asset not found");
        }

        // Sanitize filename
        const safeName = file.originalname
            .normalize("NFD")                // supprime les accents
            .replace(/[\u0300-\u036f]/g, "") // retire les diacritiques
            .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // remplace tout caractère interdit par un "_"

        const filePath = `${userId}/${assetType}/${objectId}/${Date.now()}-${safeName}`;

        // Upload to Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Supabase upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // Save document reference in database
        return await prisma.assetDocument.create({
            data: {
                name: file.originalname,
                url: publicUrl,
                objectId: objectId,
                objectType: assetType as AssetType,
            }
        });
    }

    async getDocuments(userId: string, assetType: string, objectId: string) {
        // Validate asset type
        if (!Object.values(AssetType).includes(assetType as AssetType)) {
            throw new Error("Invalid asset type");
        }

        // Check if asset exists and belongs to user
        let asset;
        switch (assetType) {
            case 'real_estate':
                asset = await prisma.realEstate.findFirst({
                    where: { id: objectId, clerkId: userId }
                });
                break;
            case 'stock':
                asset = await prisma.stock.findFirst({
                    where: { id: objectId, clerkId: userId }
                });
                break;
            default:
                throw new Error("Asset type not supported");
        }

        if (!asset) {
            throw new Error("Asset not found");
        }

        return await prisma.assetDocument.findMany({
            where: {
                objectId: objectId,
                objectType: assetType as AssetType
            }
        });
    }

    async deleteDocument(userId: string, documentId: string) {
        // Find the document
        const document = await prisma.assetDocument.findUnique({
            where: { id: documentId }
        });

        if (!document) {
            throw new Error("Document not found");
        }

        // Verify ownership through the associated asset
        let asset;
        switch (document.objectType) {
            case 'real_estate':
                asset = await prisma.realEstate.findFirst({
                    where: {
                        id: document.objectId,
                        clerkId: userId
                    }
                });
                break;
            case 'stock':
                asset = await prisma.stock.findFirst({
                    where: {
                        id: document.objectId,
                        clerkId: userId
                    }
                });
                break;
            default:
                // Ideally checking asset is safer to ensure ownership even if type allows it
                throw new Error("Asset type verification not implemented");
        }

        if (!asset) {
            throw new Error("Not authorized to delete this document");
        }

        // Extract filename from URL
        const filePath = new URL(document.url).pathname.split('/').pop(); // This might only get the filename, not the full path in bucket

        // Construct full path for Supabase: userId/type/objectId/filename
        // But `filePath` here is just the filename part.
        // The previous code did: const filePath = new URL(document.url).pathname.split('/').pop();
        // And then: .remove([`${userId}/${document.objectType}/${document.objectId}/${filePath}`]);
        // This logic assumes the structure we created in upload.

        if (filePath) {
            // Delete file from Supabase storage
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([`${userId}/${document.objectType}/${document.objectId}/${filePath}`]);

            if (storageError) {
                console.error('Error deleting file from storage:', storageError);
                // We continue to delete from DB? logic says yes usually
            }
        }

        // Delete document record from database
        await prisma.assetDocument.delete({
            where: { id: documentId }
        });

        return { message: "Document deleted successfully" };
    }
}
