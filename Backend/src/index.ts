import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import hrRoutes from './routes/hrRoutes';
import studentRoutes from './routes/studentRoutes';
import profileRoutes from './routes/profileRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import internshipRoutes from './routes/internshipRoutes';
import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server default port
    'http://localhost:3000', // Alternative frontend port
    'http://localhost:4173', // Vite preview server port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Routes
app.use(authRoutes);
app.use(hrRoutes);
app.use(studentRoutes);
app.use(profileRoutes);
app.use(feedbackRoutes);
app.use(internshipRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

// Export the Express app as the Vercel serverless function
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
