// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

/**
 * Middleware pour vérifier si un utilisateur est authentifié via Clerk.
 * - Si l’utilisateur est authentifié → continue vers la route suivante
 * - Si non authentifié → 401 Unauthorized
 * - Si erreur lors de la vérification → 500 Internal Server Error
 */
export function requireAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }


    next();
  } catch (error: any) {
    console.error("Erreur d'auth Clerk :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification de l'authentification",
      error: error.message || error,
    });
  }
}
