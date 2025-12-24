"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const realEstate_controller_1 = require("../controllers/realEstate.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post('/', authMiddleware_1.requireAuthMiddleware, realEstate_controller_1.RealEstateController.create);
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
router.get('/', authMiddleware_1.requireAuthMiddleware, realEstate_controller_1.RealEstateController.getAll);
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
router.get('/:id', authMiddleware_1.requireAuthMiddleware, realEstate_controller_1.RealEstateController.getById);
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
router.put('/:id', authMiddleware_1.requireAuthMiddleware, realEstate_controller_1.RealEstateController.update);
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
router.delete('/:id', authMiddleware_1.requireAuthMiddleware, realEstate_controller_1.RealEstateController.delete);
exports.default = router;
