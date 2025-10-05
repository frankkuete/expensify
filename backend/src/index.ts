import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import assetsRoutes from './routes/assets';
import { requireAuthMiddleware } from "./middlewares/authMiddleware";


dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

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


// Use requireAuth() to protect this route
// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get('/api/logged_user', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
  }
  const user = await clerkClient.users.getUser(userId);

  return res.json({ user_id: user.id, 
                    email: user.emailAddresses[0].emailAddress , 
                    name: user.firstName , 
                    lastName: user.lastName});
})

app.use("/api/assets", assetsRoutes);

try {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

