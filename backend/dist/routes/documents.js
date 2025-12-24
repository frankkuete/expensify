"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = require("../controllers/document.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
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
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the document was last updated
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
router.post('/:assetType/:objectId', authMiddleware_1.requireAuthMiddleware, uploadMiddleware_1.upload.single('file'), document_controller_1.DocumentController.upload);
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
router.get('/:assetType/:objectId', authMiddleware_1.requireAuthMiddleware, document_controller_1.DocumentController.getDocuments);
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
router.delete('/:documentId', authMiddleware_1.requireAuthMiddleware, document_controller_1.DocumentController.delete);
exports.default = router;
