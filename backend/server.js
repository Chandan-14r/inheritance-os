import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import assetRoutes from './routes/assets.js';
import beneficiaryRoutes from './routes/beneficiaries.js';
import aiRoutes from './routes/ai.js';
import simulatorRoutes from './routes/simulator.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/simulator', simulatorRoutes);

import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    // Try to connect to real Mongo URI
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.log('⚠️ Local MongoDB not running. Starting in-memory database for demo...');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ In-Memory MongoDB connected at', uri);
  }
  
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server listening on port ${process.env.PORT || 5000}`)
  );
};

connectDB();
