"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const express_1 = require("@clerk/express");
const document_service_1 = require("../services/document.service");
const documentService = new document_service_1.DocumentService();
class DocumentController {
    static async upload(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { assetType, objectId } = req.params;
            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const document = await documentService.uploadDocument(userId, file, assetType, objectId);
            res.status(201).json(document);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === "Invalid asset type" || error.message === "Asset type not supported for document association") {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message === "Asset not found") {
                    return res.status(404).json({ error: error.message });
                }
            }
            console.error(error);
            res.status(500).json({ error: "Failed to upload document" });
        }
    }
    static async getDocuments(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { assetType, objectId } = req.params;
            const documents = await documentService.getDocuments(userId, assetType, objectId);
            res.json(documents);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === "Invalid asset type") {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message === "Asset not found") {
                    return res.status(404).json({ error: error.message });
                }
            }
            console.error(error);
            res.status(500).json({ error: "Failed to fetch documents" });
        }
    }
    static async delete(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { documentId } = req.params;
            const result = await documentService.deleteDocument(userId, documentId);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === "Document not found") {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message === "Not authorized to delete this document") {
                    return res.status(403).json({ error: error.message });
                }
            }
            console.error('Delete document error:', error);
            res.status(500).json({ error: "Failed to delete document" });
        }
    }
}
exports.DocumentController = DocumentController;
