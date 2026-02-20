import { Router } from 'express';
import Joi from 'joi';
import { register, login } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate';

const router = Router();

const registerSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(80).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role:     Joi.string().valid('admin', 'designer', 'developer'),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validateBody(registerSchema), register);
router.post('/login',    validateBody(loginSchema),    login);

export default router;
