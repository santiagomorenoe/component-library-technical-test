import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  mongoose.connection.on('connected', () => console.log('[db] MongoDB connected'));
  mongoose.connection.on('disconnected', () => console.warn('[db] MongoDB disconnected'));
  mongoose.connection.on('error', (err) => console.error('[db] MongoDB error:', err));

  await mongoose.connect(uri);
}
