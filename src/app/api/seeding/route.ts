// app/api/antrian/route.ts
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function GET() {
  try {
    const seededUsers = await prisma.user.createMany({
      data: [
        {
          name: 'LOKET 1',
          username: 'loketsatu',
          password: await hashPassword('@loket1'),
          statusUser: true,
          type: 'Umum'
        },
        {
          name: 'LOKET 2',
          username: 'loketdua',
          password: await hashPassword('@loket2'),
          statusUser: true,
          type: 'Umum'
        },
        {
          name: 'LOKET 3',
          username: 'lokettiga',
          password: await hashPassword('@loket3'),
          statusUser: true,
          type: 'Umum'
        },
        {
          name: 'LOKET 4',
          username: 'loketempat',
          password: await hashPassword('@loket4'),
          statusUser: true,
          type: 'Umum'
        },
        {
          name: 'LOKET 5',
          username: 'loketlima',
          password: await hashPassword('@loket5'),
          statusUser: true,
          type: 'Umum'
        },
        {
          name: 'LOKET 6',
          username: 'loketenam',
          password: await hashPassword('@loket6'),
          statusUser: true,
          type: 'Umum'
        },
        {
          name: 'LOKET VERIFIKASI',
          username: 'loketverifikasi',
          password: await hashPassword('@loketverifikasi1'),
          statusUser: true,
          type: 'Verifikasi'
        },
      ],
    });

    return NextResponse.json({
      message: 'User table seeded successfully',
      count: seededUsers.count,
    });
  } catch (error) {
    console.error('Error seeding User data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}