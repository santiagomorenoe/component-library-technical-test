import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Validation middleware factory.
 * Validates req.body against the given Joi schema.
 * On success, replaces req.body with the sanitised/defaulted value.
 * On failure, responds 400 with a human-readable message.
 */
export function validateBody(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: true, stripUnknown: true });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    req.body = value;
    next();
  };
}

/**
 * Validation middleware factory for query params.
 */
export function validateQuery(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { abortEarly: true, allowUnknown: false });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    req.query = value;
    next();
  };
}
