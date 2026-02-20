import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

function signToken(id: string, role: string): string {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id, role }, secret, { expiresIn });
}

export async function register(req: Request, res: Response): Promise<void> {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const user = await User.create(req.body);
  const token = signToken(String(user._id), user.role);

  res.status(201).json({ token, user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken(String(user._id), user.role);
  res.json({ token, user });
}
