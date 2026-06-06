import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Establish connection to MongoDB
connectDB();

const app = express();

// Setup Cross-Origin Resource Sharing
app.use(cors());

// Body parser middlewares for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware in development environment
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authentication API is active and operational',
    timestamp: new Date().toISOString()
  });
});

// Fallback: 404 Route Not Found handler
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler middleware for JSON formatted exceptions
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
