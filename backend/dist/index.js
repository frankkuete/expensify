"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const express_2 = require("@clerk/express");
const swagger_1 = __importDefault(require("./config/swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const realEstate_1 = __importDefault(require("./routes/realEstate"));
const documents_1 = __importDefault(require("./routes/documents"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use('/api/real-estate', realEstate_1.default);
app.use('/api/documents', documents_1.default);
// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Basic health check route (public)
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Use requireAuth() to protect this route If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get('/api/logged_user', (0, express_2.requireAuth)(), async (req, res) => {
    // Use `getAuth()` to get the user's `userId`
    const { userId } = (0, express_2.getAuth)(req);
    // Use Clerk's JavaScript Backend SDK to get the user's User object
    if (!userId) {
        return res.status(400).json({ error: 'User ID is missing or invalid' });
    }
    const user = await express_2.clerkClient.users.getUser(userId);
    return res.json({ user_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName,
        lastName: user.lastName });
});
try {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}
