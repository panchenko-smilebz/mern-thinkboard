import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(
  cors({
    origin: 'http://localhost:5173', // Adjust as needed for your frontend
  }),
);
app.use(express.json());
app.use(rateLimiter);

app.use('/api/notes', notesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
  });
});
