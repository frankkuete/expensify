import { Request, Response } from 'express';
import { getAuth } from "@clerk/express";
import { realEstateSchema } from "../types/asset.types";
import { RealEstateService } from "../services/realEstate.service";
import { z } from "zod";

const realEstateService = new RealEstateService();

export class RealEstateController {

    static async create(req: Request, res: Response) {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }

            const validatedData = realEstateSchema.parse(req.body);
            const realEstate = await realEstateService.create(userId, validatedData);

            res.status(201).json(realEstate);
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ error: err.issues });
            }
            console.error(err);
            res.status(500).json({ error: "Failed to create real estate asset" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }

            const properties = await realEstateService.getAll(userId);
            res.json(properties);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch real-estate assets" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }

            const property = await realEstateService.getById(userId, req.params.id);

            if (!property) {
                return res.status(404).json({ error: "Property not found" });
            }

            res.json(property);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch specified real-estate asset" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }

            const validatedData = realEstateSchema.parse(req.body);
            const updated = await realEstateService.update(userId, req.params.id, validatedData);

            res.json(updated);
        } catch (error) {
            if (error instanceof Error && error.message === "Property not found") {
                return res.status(404).json({ error: "Property not found" });
            }
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.issues });
            }
            res.status(400).json({ error: "Failed to update specified real-estate asset" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing or invalid" });
            }

            const result = await realEstateService.delete(userId, req.params.id);
            res.json(result);
        } catch (error) {
            if (error instanceof Error && error.message === "Property not found") {
                return res.status(404).json({ error: "Property not found" });
            }
            console.error('Delete error:', error);
            res.status(500).json({ error: "Failed to delete asset and its documents" });
        }
    }
}
