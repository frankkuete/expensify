// src/routes/assets.ts
import { Router, Request, Response } from "express";
import { AssetType, PrismaClient } from "@prisma/client";
import { requireAuth,getAuth } from "@clerk/express";
import { supabase } from "../services/supabase";
import { decode } from "base64-arraybuffer";
import { requireAuthMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

const prisma = new PrismaClient();
const router = Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Asset:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - value
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré de l'asset
 *         name:
 *           type: string
 *           description: Nom de l'asset
 *         type:
 *           type: string
 *           enum: [REAL_ESTATE, VEHICLE, JEWELRY, ART, STOCK, CRYPTO, OTHER]
 *           description: Type d'asset
 *         description:
 *           type: string
 *           description: Description de l'asset
 *         value:
 *           type: number
 *           description: Valeur totale de l'asset
 *         currency:
 *           type: string
 *           default: USD
 *           description: Devise de l'asset
 *         quantity:
 *           type: number
 *           default: 1
 *           description: Quantité de l'asset
 *         unitValue:
 *           type: number
 *           description: Valeur unitaire de l'asset
 *         clerkId:
 *           type: string
 *           description: ID de l'utilisateur propriétaire
 */

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Créer un nouvel asset
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asset'
 *     responses:
 *       201:
 *         description: Asset créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *
 *   get:
 *     summary: Récupérer tous les assets de l'utilisateur
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       401:
 *         description: Non authentifié
 */

/**
 * @swagger
 * /api/assets/{id}:
 *   put:
 *     summary: Mettre à jour un asset
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asset'
 *     responses:
 *       200:
 *         description: Asset mis à jour avec succès
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Asset non trouvé
 *
 *   delete:
 *     summary: Supprimer un asset
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset supprimé avec succès
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Asset non trouvé
 */

/**
 * @swagger
 * /api/assets/{id}/documents:
 *   post:
 *     summary: Upload un document pour un asset
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       200:
 *         description: Document uploadé avec succès
 *       400:
 *         description: Fichier manquant
 *       403:
 *         description: Accès interdit
 */

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Créer un nouvel asset
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asset'
 *     responses:
 *       201:
 *         description: Asset créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *
 *   get:
 *     summary: Récupérer tous les assets de l'utilisateur
 *     tags: [Assets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       401:
 *         description: Non authentifié
 */
router.post("/", requireAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, type, description, value, currency, quantity, unitValue} = req.body;
    const { userId } = getAuth(req); // Clerk injecte userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }

    const asset = await prisma.asset.create({
      data: {
        clerkId: userId,
        name,
        type: AssetType[type as keyof typeof AssetType],
        description,
        value ,
        currency: currency || "USD",
        quantity: quantity || 1,
        unitValue: unitValue || value,
      },
      include: { category: true, subcategory: true
        },
    });

    res.json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create asset" });
  }
});

// ✅ Lister les assets de l’utilisateur
router.get("/", requireAuthMiddleware, async (req: Request, res: Response) => {
    
  try {
    const { userId } = getAuth(req); // Clerk injecte userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing or invalid" });
    }
    console.log("Fetching assets for user:", userId);
    const clerkId = userId;
    const assets = await prisma.asset.findMany({
      where: { clerkId },
      include: {  category: true, subcategory: true },
    });
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
});

// ✅ Upload document lié à un asset
router.post("/:id/documents", requireAuthMiddleware, upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset || asset.clerkId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file provided" });
    
    // decode file buffer to base64
    const fileBase64 = decode(file.buffer.toString("base64"));

    // upload the file to supabase
    
    const safePath = 'assets_documents/' + Date.now() ;;

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(safePath, fileBase64, { 
        contentType: file.mimetype, 
        upsert: true }
      );

    if (error) throw error;

    const publicUrl = supabase.storage.from("documents").getPublicUrl(data.path).data.publicUrl;

    const document = await prisma.assetDocument.create({
      data: {
        assetId: id,
        name: file.originalname,
        url: publicUrl,
      },
    });

    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// ✅ Supprimer un asset
router.delete("/:id", requireAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);

    const asset = await prisma.asset.findUnique({ 
      where: { id },
      include: { AssetDocuments: true }
    });


    if (!asset || asset.clerkId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Supprimer les fichiers de Supabase
    for (const document of asset.AssetDocuments) {
      const filePath = document.url.split('/').pop(); // Extrait le nom du fichier de l'URL
      if (filePath) {
        const { error } = await supabase.storage
          .from("documents")
          .remove([`assets_documents/${filePath}`]);
        
        if (error) {
          console.error(`Failed to delete file from storage: ${filePath}`, error);
        }
      }
    }

    // Supprimer l'asset et ses documents (les documents seront automatiquement supprimés grâce à la cascade)
    await prisma.asset.delete({ 
      where: { id }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete asset" });
  }
});


router.put("/:id", requireAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    const { name, type, description, value, currency, quantity, unitValue } = req.body;

    // Vérifier si l'asset existe et appartient à l'utilisateur
    const existingAsset = await prisma.asset.findUnique({ where: { id } });
    if (!existingAsset || existingAsset.clerkId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Mettre à jour l'asset
    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        name,
        type: AssetType[type as keyof typeof AssetType],
        description,
        value,
        quantity,
        unitValue,
        currency,
      },
    });

    res.json(updatedAsset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update asset" });
  }
});
export default router;
