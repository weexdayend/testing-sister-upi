// app/api/antrian/route.ts
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      const fetchData = async () => {
        try {
          // Fetch all users
          const users = await prisma.user.findMany();

          // Fetch all entries from the Antrian table
          const antrianData = await prisma.antrian.findMany();

          // Map users to their nomorAntrian if they have one
          const result = users.map(user => {
            const userAntrian = antrianData.find(antrian => antrian.assigned === user.id);
            return {
              userId: user.id,
              userName: user.name,
              nomorAntrian: userAntrian ? userAntrian.nomorAntrian : null,
              type: user.type
            };
          });

          // Send data as an SSE event
          sendEvent(result);
        } catch (error) {
          console.error('Error fetching Antrian data:', error);
          sendEvent({ error: 'Failed to fetch data' });
        }
      };

      // Fetch data initially and every 10 seconds
      fetchData();
      const intervalId = setInterval(fetchData, 10000);

      // Close the stream if the client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}
