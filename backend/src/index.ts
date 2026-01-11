import authRoutes from './routes/auth';
import questRoutes from './routes/quests';
import { checkExpiredQuests } from './services/cron';
import transactionRoutes from './routes/transactions';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import disputeRoutes from './routes/disputes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host} 🍃`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Connect to DB immediately
connectDB();

// Basic Route
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/transactions', transactionRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('CampusJugaad API is running & DB Connected! 🚀');
});
app.use('/api/disputes', disputeRoutes);


setInterval(() => {
  checkExpiredQuests();
}, 60000); 

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// REQUIRED: Export the app for Vercel
export default app;

