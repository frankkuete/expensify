import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, requireAuth, getAuth, clerkClient } from '@clerk/express';


dotenv.config();


const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test user creation endpoint
app.post('/api/users/test', async (req, res) => {
  try {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        clerkId: `test_${Date.now()}`,
        name: 'Test User'
      }
    });
    res.json(testUser);
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ error: 'Failed to create test user' });
  }
});

// Test Prisma connection and query
app.get('/api/users/count', async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ count });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

 
// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } =  getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  return res.json({user})
})

try {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

