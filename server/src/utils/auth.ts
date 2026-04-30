import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const generateOpaqueToken = () => crypto.randomBytes(48).toString('hex');
export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const signAccessToken = (payload: { sub: string; role: 'owner' | 'manager' | 'analyst'; email: string }) => (
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' })
);
