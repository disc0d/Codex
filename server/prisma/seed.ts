import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'ameer.mubarak1235@gmail.com';
  const passwordHash = await bcrypt.hash('ameer1234ameer', 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'owner', isVerified: true },
    create: { email, passwordHash, role: 'owner', isVerified: true }
  });
}

main().finally(() => prisma.$disconnect());
