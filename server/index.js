import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport, { googleAuthRoutes } from './config/passport.js';
import { setupSwagger } from './config/swagger.js';
import errorHandler from './middleware/errorHandler.js';
import { seedAchievements } from './services/gamificationService.js';
import { setupSockets } from './sockets/index.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import generalRoutes from './routes/generalRoutes.js';

const startServer = async () => {
  await connectDB();
  try { await seedAchievements(); } catch (e) { console.error('Seed failed:', e.message); }
};
startServer();


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});

app.set('io', io);
setupSockets(io);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use('/api/', limiter);

configurePassport();
app.use(passport.initialize());
googleAuthRoutes(app);

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'RiseTogether API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api', generalRoutes);

setupSwagger(app);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
