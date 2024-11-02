// app/api/antrian/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; 

export async function GET(request: Request) {
  try {
    const data = await prisma.panggilan.findMany({
      where: {
        statusPanggilan: false
      }
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating Antrian:', error);
    return NextResponse.json({ error: 'Failed to create Antrian' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      nomorAntrian,
      assigned,
      statusPanggilan,
    } = await request.json();
    // Create a new record in the Antrian model
    const newAntrian = await prisma.panggilan.create({
      data: {
        nomorAntrian,
        assigned,
        statusPanggilan,
      },
    });

    return NextResponse.json(newAntrian, { status: 201 });
  } catch (error) {
    console.error('Error creating Antrian:', error);
    return NextResponse.json({ error: 'Failed to create Antrian' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      statusPanggilan,
    } = await request.json();
    // Create a new record in the Antrian model
    const newAntrian = await prisma.panggilan.update({
      where:{
        id
      },
      data: {
        statusPanggilan,
      },
    });

    return NextResponse.json(newAntrian, { status: 201 });
  } catch (error) {
    console.error('Error creating Antrian:', error);
    return NextResponse.json({ error: 'Failed to create Antrian' }, { status: 500 });
  }
}