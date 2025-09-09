import express from 'express';
import { loginAdmin, loginOperator, loginSectionController, logout, registerAdmin, registerOperator, registerSectionController } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/v1/register/admin', registerAdmin)
router.post('/v1/login/admin', loginAdmin)

router.post('/v1/register/operator', registerOperator)
router.post('/v1/login/operator', loginOperator)

router.post('/v1/register/sectioncontroller', registerSectionController)
router.post('/v1/login/sectioncontroller', loginSectionController)

router.get('/v1/logout', logout)

export default router