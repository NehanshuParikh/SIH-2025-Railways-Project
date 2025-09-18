import { configDotenv } from 'dotenv';
configDotenv()

import express from 'express'
const app = express();

import connectDb from './db/db.js'
connectDb()

import cookieParser from 'cookie-parser'

import morgan from 'morgan'

import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import adminAssignementRoutes from './routes/adminAssignementRoutes.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(cors({
  origin: "http://localhost:5173",  // React app
  credentials: true,               // allow cookies
}));

app.use((req, res, next) => {
  console.log("🔥 Incoming:", req.method, req.url);
  next();
});

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/assignments/', adminAssignementRoutes)

app.get('/',(req,res)=>{
    res.send('Hello')
})

export default app