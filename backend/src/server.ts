import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend dist directory
  const frontendDistPath = path.join(__dirname, '../../dist');
  app.use(express.static(frontendDistPath));
  
  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler - this should be the last middleware
app.use((req, res) => {
  // If the request is for an API route, return JSON error
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API Route not found' });
  } else {
    // For non-API routes, let the frontend handle it (for React Router)
    if (process.env.NODE_ENV === 'production') {
      const frontendDistPath = path.join(__dirname, '../../dist');
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});