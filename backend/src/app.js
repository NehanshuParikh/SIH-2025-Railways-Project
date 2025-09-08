import { configDotenv } from 'dotenv';
configDotenv()

import express from 'express'
const app = express();

import connectDb from './db/db.js'
connectDb()

import authRoutes from './routes/authRoutes.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api/auth', authRoutes)

app.get('/',(req,res)=>{
    res.send('Hello')
})

export default app