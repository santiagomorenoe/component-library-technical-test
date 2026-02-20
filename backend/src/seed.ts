import 'dotenv/config';
import { connectDB } from './config/db';
import { User } from './models/User';

const SEED_USER = {
  name: 'Santiago Moreno',
  email: 'morenoestradasantiago@gmail.com',
  password: 'password123',
  role: 'admin' as const,
};

(async () => {
  await connectDB();

  const existing = await User.findOne({ email: SEED_USER.email });
  if (existing) {
    console.log(`[seed] User already exists: ${SEED_USER.email}`);
    process.exit(0);
  }

  await User.create(SEED_USER);
  console.log(`[seed] ✓ Created user: ${SEED_USER.email}`);
  process.exit(0);
})().catch((err: Error) => {
  console.error('[seed] Error:', err.message);
  process.exit(1);
});
