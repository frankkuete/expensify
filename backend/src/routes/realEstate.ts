import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { realEstateSchema, type RealEstateInput } from "../types/asset.types";
import { requireAuth, getAuth } from "@clerk/express";
import { z } from "zod";
import {supabase} from '../services/supabase';
import { requireAuthMiddleware } from '../middlewares/authMiddleware';
const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     RealEstate:
 *       type: object
 *       required:
 *         - name
 *         - value
 *         - location
 *         - address
 *         - surface
 *         - yearBuilt
 *         - propertyType
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Villa Mediterranean"
 *         description:
 *           type: string
 *           example: "Beautiful villa with sea view"
 *         value:
 *           type: number
 *           format: decimal
 *           example: 850000
 *         currency:
 *           type: string
 *           default: "USD"
 *           example: "EUR"
 *         location:
 *           type: string
 *           example: "Nice"
 *         address:
 *           type: string
 *           example: "123 Promenade des Anglais"
 *         surface:
 *           type: number
 *           example: 200
 *         yearBuilt:
 *           type: integer
 *           example: 2015
 *         propertyType:
 *           type: string
 *           enum: [HOUSE, APARTMENT, LAND, COMMERCIAL, OTHER]
 *         rooms:
 *           type: integer
 *           example: 5
 *         bathrooms:
 *           type: integer
 *           example: 3
 *         hasParking:
 *           type: boolean
 *           example: true
 *         hasGarden:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/real-estate:
 *   post:
 *     summary: Create a new real estate property
 *     tags: [Real Estate]
 *     security:
 *       - clerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RealEstate'
 *     responses:
 *       201:
 *         description: Real estate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RealEstate'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireAuthMiddleware, async (req, res) => {
  try {
    const validatedData = realEstateSchema.parse(req.body);
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }
    
    const realEstate = await prisma.realEstate.create({
      data: {
        clerkId: userId,
        name: validatedData.name,
        description: validatedData.description,
        value: validatedData.value,
        currency: validatedData.currency,
        location: validatedData.location,
        address: validatedData.address,
        surface: validatedData.surface,
        yearBuilt: validatedData.yearBuilt,
        propertyType: validatedData.propertyType,
        rooms: validatedData.rooms,
        bathrooms: validatedData.bathrooms,
        hasParking: validatedData.hasParking,
        hasGarden: validatedData.hasGarden,
      },
    });

    res.status(201).json(realEstate);
  } catch (err) {
    if (err instanceof z.ZodError) {
          return res.status(400).json({ error: err.issues });
        }
        console.error(err);
        res.status(500).json({ error: "Failed to create real estate asset" });
  }
});

/**
 * @swagger
 * /api/real-estate:
 *   get:
 *     summary: Get all real estate properties for the authenticated user
 *     tags: [Real Estate]
 *     security:
 *       - clerkAuth: []
 *     responses:
 *       200:
 *         description: List of real estate properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RealEstate'
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }
    const properties = await prisma.realEstate.findMany({
      where: {
        clerkId: userId
      }
    });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch real-estate assets" });
  }
});

/**
 * @swagger
 * /api/real-estate/{id}:
 *   get:
 *     summary: Get a specific real estate property
 *     tags: [Real Estate]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Real estate property details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RealEstate'
 *       404:
 *         description: Property not found
 */
router.get('/:id', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }
    const property = await prisma.realEstate.findFirst({
      where: {
        id: req.params.id,
        clerkId: userId
      }
    });
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specified real-estate asset" });
  }
});

/**
 * @swagger
 * /api/real-estate/{id}:
 *   put:
 *     summary: Update a real estate property
 *     tags: [Real Estate]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RealEstate'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
router.put('/:id', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }
    const validatedData = realEstateSchema.parse(req.body);
    
    const property = await prisma.realEstate.findFirst({
      where: {
        id: req.params.id,
        clerkId: userId
      }
    });
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    const updated = await prisma.realEstate.update({
      where: { id: req.params.id },
      data: validatedData
    });
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update specified real-estate asset"  });
  }
});

/**
 * @swagger
 * /api/real-estate/{id}:
 *   delete:
 *     summary: Delete a real estate property and its associated documents
 *     tags: [Real Estate]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the real estate property to delete
 *     responses:
 *       200:
 *         description: Property and associated documents deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property and associated documents deleted successfully"
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Property not found"
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Server error while deleting property or documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete asset and its documents"
 */
router.delete('/:id', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }
    
    const property = await prisma.realEstate.findFirst({
      where: {
        id: req.params.id,
        clerkId: userId
      }
    });
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Find all associated documents
    const documents = await prisma.assetDocument.findMany({
      where: {
        objectId: req.params.id,
        objectType: 'real_estate'
      }
    });

    // Delete documents from Supabase storage
    for (const document of documents) {
      const filePath = new URL(document.url).pathname.split('/').pop();
      if (filePath) {
        const { error } = await supabase.storage
          .from('documents')
          .remove([`${userId}/real_estate/${req.params.id}/${filePath}`]);
          
        if (error) {
          console.error('Error deleting file from Supabase:', error);
        }
      }
    }

    // Use a transaction to delete both the property and its documents
    await prisma.$transaction(async (tx) => {
      // Delete all associated documents from database
      await tx.assetDocument.deleteMany({
        where: {
          objectId: req.params.id,
          objectType: 'real_estate'
        }
      });

      // Delete the property
      await tx.realEstate.delete({
        where: { id: req.params.id }
      });
    });
    
    res.json({ message: "Property and associated documents deleted successfully" });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: "Failed to delete asset and its documents" });
  }
});

export default router;