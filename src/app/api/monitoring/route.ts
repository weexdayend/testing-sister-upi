// app/api/antrian/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Fetch all users
    const users = await prisma.user.findMany();

    // Fetch all entries from the Antrian table
    const antrianData = await prisma.antrian.findMany({
      where: {
        statusAntrian: "Progress"
      }
    });

    // Map users to their nomorAntrian if they have one
    const result = users.map((user: any) => {
      const userAntrian = antrianData.find(antrian => antrian.assigned === user.id);
      return {
        userId: user.id,
        userName: user.name,
        nomorAntrian: userAntrian ? userAntrian.nomorAntrian : '-',
        type: user.type
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating Antrian:', error);
    return NextResponse.json({ error: 'Failed to create Antrian' }, { status: 500 });
  }
}
