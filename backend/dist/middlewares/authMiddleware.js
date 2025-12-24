"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuthMiddleware = requireAuthMiddleware;
const express_1 = require("@clerk/express");
/**
 * Middleware pour vérifier si un utilisateur est authentifié via Clerk.
 * - Si l’utilisateur est authentifié → continue vers la route suivante
 * - Si non authentifié → 401 Unauthorized
 * - Si erreur lors de la vérification → 500 Internal Server Error
 */
function requireAuthMiddleware(req, res, next) {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        next();
    }
    catch (error) {
        console.error("Erreur d'auth Clerk :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la vérification de l'authentification",
            error: error.message || error,
        });
    }
}
