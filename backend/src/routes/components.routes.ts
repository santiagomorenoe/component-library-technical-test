import { Router } from 'express';
import Joi from 'joi';
import { track, getStats, exportCSV, exportJSON } from '../controllers/components.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';

const router = Router();

const trackSchema = Joi.object({
  componentName: Joi.string().trim().min(1).max(120).required(),
  variant: Joi.string().trim().max(80).default('default'),
  action: Joi.string().trim().valid('render', 'click', 'hover', 'mount', 'unmount').required(),
  projectId: Joi.string().trim().max(120),
  userId: Joi.string().trim().max(120),
  timestamp: Joi.date().iso().default(() => new Date()),
  metadata: Joi.object().unknown(true),
});

const statsQuerySchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso().min(Joi.ref('from')),
  componentName: Joi.string().trim().max(120),
  projectId: Joi.string().trim().max(120),
});

const exportQuerySchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso().min(Joi.ref('from')),
  componentName: Joi.string().trim().max(120),
  projectId: Joi.string().trim().max(120),
});

router.post('/track', validateBody(trackSchema), track);
router.get('/stats', validateQuery(statsQuerySchema), getStats);
router.get('/export', authenticate, validateQuery(exportQuerySchema), exportCSV);
router.get('/export/json', authenticate, validateQuery(exportQuerySchema), exportJSON);

export default router;
