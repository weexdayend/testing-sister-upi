// app/api/antrian/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; 

export async function GET(request: Request) {
  // Headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: any) => {
        const encodedData = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
        controller.enqueue(encodedData);
      };

      const fetchData = async () => {
        try {
          const data = await prisma.panggilan.findMany({
            where: {
              statusPanggilan: false
            }
          });

          // Send the fetched data
          sendEvent(data);
        } catch (error) {
          console.error('Error fetching Panggilan data:', error);
          sendEvent({ error: 'Failed to fetch data' });
        }
      };

      // Fetch data initially
      fetchData();

      // Poll every few seconds (you can adjust the interval based on your requirements)
      const intervalId = setInterval(fetchData, 5000);

      // Close the connection if the client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
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