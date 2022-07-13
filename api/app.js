import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import multer from 'multer';
import authRouter from './routes/authRoutes';
import usersRouter from './routes/usersRoutes';
import hotelsRouter from './routes/hotelsRoutes';
import roomsRouter from './routes/roomsRoutes';

import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app = express();

dotenv.config({ path: './config.env' });

const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '/images')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded');
});

// note: Routes Middleware
// app.use('/');
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/hotels', hotelsRouter);
app.use('/api/v1/rooms', roomsRouter);

// Global error handling middleware
app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
