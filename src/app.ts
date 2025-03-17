import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ebayRoutes from './routes/ebay.routes';
import ebayAuthRoutes from './routes/ebay-auth.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ebay', ebayRoutes);
app.use('/api/ebay/auth', ebayAuthRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 