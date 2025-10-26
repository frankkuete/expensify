import { Router } from 'express';
import { PrismaClient, AssetType } from '@prisma/client';
import { requireAuth, getAuth } from "@clerk/express";
import multer from 'multer';
import { supabase } from '../services/supabase';
import { requireAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - name
 *         - url
 *         - objectId
 *         - objectType
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the document
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           description: The name of the document
 *           example: "deed_of_sale.pdf"
 *         url:
 *           type: string
 *           description: The URL where the document is stored
 *           example: "https://example.com/documents/deed_of_sale.pdf"
 *         objectId:
 *           type: string
 *           format: uuid
 *           description: The ID of the associated asset
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         objectType:
 *           type: string
 *           enum: [real_estate, stock, bond, etf, cash, custom]
 *           description: The type of asset this document belongs to
 *           example: "real_estate"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the document was created
 *           example: "2024-02-26T14:30:00Z"
 */

/**
 * @swagger
 * /api/documents/{assetType}/{objectId}:
 *   post:
 *     summary: Upload a document for a specific asset
 *     tags: [Documents]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: assetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [real_estate, stock, bond, etf, cash, custom]
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Invalid input or file missing
 *       404:
 *         description: Asset not found
 */
router.post('/:assetType/:objectId', requireAuthMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { assetType, objectId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate asset type
    if (!Object.values(AssetType).includes(assetType as AssetType)) {
      return res.status(400).json({ error: "Invalid asset type" });
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
    }

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Upload to Supabase
    const safeName = file.originalname
    .normalize("NFD")                // supprime les accents
    .replace(/[\u0300-\u036f]/g, "") // retire les diacritiques
    .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // remplace tout caractère interdit par un "_"

    const fileName = `${userId}/${assetType}/${objectId}/${Date.now()}-${safeName}`; //
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Save document reference in database
    const document = await prisma.assetDocument.create({
      data: {
        name: file.originalname,
        url: publicUrl,
        objectId: objectId,
        objectType: assetType as AssetType,
      }
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

/**
 * @swagger
 * /api/documents/{assetType}/{objectId}:
 *   get:
 *     summary: Get all documents for a specific asset
 *     tags: [Documents]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: assetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [real_estate, stock, bond, etf, cash, custom]
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       404:
 *         description: Asset not found
 */
router.get('/:assetType/:objectId', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { assetType, objectId } = req.params;

    // Validate asset type
    if (!Object.values(AssetType).includes(assetType as AssetType)) {
      return res.status(400).json({ error: "Invalid asset type" });
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
    }

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Get documents
    const documents = await prisma.assetDocument.findMany({
      where: {
        objectId: objectId,
        objectType: assetType as AssetType
      }
    });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

/**
 * @swagger
 * /api/documents/{documentId}:
 *   delete:
 *     summary: Delete a specific document
 *     tags: [Documents]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the document to delete
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Document deleted successfully"
 *       404:
 *         description: Document not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:documentId', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { documentId } = req.params;

    // Find the document
    const document = await prisma.assetDocument.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
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
      // Add other asset types here as needed
    }

    if (!asset) {
      return res.status(403).json({ error: "Not authorized to delete this document" });
    }

    // Extract filename from URL
    const filePath = new URL(document.url).pathname.split('/').pop();
    if (filePath) {
      // Delete file from Supabase storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([`${userId}/${document.objectType}/${document.objectId}/${filePath}`]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }
    }

    // Delete document record from database
    await prisma.assetDocument.delete({
      where: { id: documentId }
    });

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});


export default router;