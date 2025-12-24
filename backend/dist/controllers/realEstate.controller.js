"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateController = void 0;
const express_1 = require("@clerk/express");
const asset_types_1 = require("../types/asset.types");
const realEstate_service_1 = require("../services/realEstate.service");
const zod_1 = require("zod");
const realEstateService = new realEstate_service_1.RealEstateService();
class RealEstateController {
    static async create(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }
            const validatedData = asset_types_1.realEstateSchema.parse(req.body);
            const realEstate = await realEstateService.create(userId, validatedData);
            res.status(201).json(realEstate);
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: err.issues });
            }
            console.error(err);
            res.status(500).json({ error: "Failed to create real estate asset" });
        }
    }
    static async getAll(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }
            const properties = await realEstateService.getAll(userId);
            res.json(properties);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch real-estate assets" });
        }
    }
    static async getById(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }
            const property = await realEstateService.getById(userId, req.params.id);
            if (!property) {
                return res.status(404).json({ error: "Property not found" });
            }
            res.json(property);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch specified real-estate asset" });
        }
    }
    static async update(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }
            const validatedData = asset_types_1.realEstateSchema.parse(req.body);
            const updated = await realEstateService.update(userId, req.params.id, validatedData);
            res.json(updated);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Property not found") {
                return res.status(404).json({ error: "Property not found" });
            }
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: error.issues });
            }
            res.status(400).json({ error: "Failed to update specified real-estate asset" });
        }
    }
    static async delete(req, res) {
        try {
            const { userId } = (0, express_1.getAuth)(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }
            const result = await realEstateService.delete(userId, req.params.id);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Property not found") {
                return res.status(404).json({ error: "Property not found" });
            }
            console.error('Delete error:', error);
            res.status(500).json({ error: "Failed to delete asset and its documents" });
        }
    }
}
exports.RealEstateController = RealEstateController;
