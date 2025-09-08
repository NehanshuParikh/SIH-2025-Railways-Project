import express from 'express';
import { loginAdmin, loginOperator, logout, registerAdmin, registerOperator } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/v1/register/admin', registerAdmin)
router.post('/v1/login/admin', loginAdmin)

router.post('/v1/register/operator', registerOperator)
router.post('/v1/login/operator', loginOperator)

router.get('/v1/logout', logout)

export default router