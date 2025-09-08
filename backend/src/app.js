import { configDotenv } from 'dotenv';
configDotenv()

import express from 'express'
const app = express();

import connectDb from './db/db.js'
connectDb()

import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.get('/',(req,res)=>{
    res.send('Hello')
})

export default app