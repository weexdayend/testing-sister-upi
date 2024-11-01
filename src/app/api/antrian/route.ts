// app/api/antrian/route.ts
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale'; // For Indonesian formatting

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    const bydate = searchParams.get('bydate') === 'true';
    const userid = searchParams.get('userid');
    const type = searchParams.get('type');

    let data;

    if (bydate) {
      // Get Jakarta time and format to `dd-MM-yyyy` for filtering
      const jakartaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
      const dateOnly = format(new Date(jakartaTime), 'dd-MM-yyyy', { locale: localeID });

      // Fetch records where `createdAt` starts with `dateOnly`
      data = await prisma.antrian.findMany({
        where: {
          createdAt: {
            startsWith: dateOnly, // Matches strings starting with the specified date
          },
          statusAntrian: userid ? "Progress" : "Open", // Set status to "Progress" if `userid` is provided, otherwise "Open"
          ...(type && { layanan: type === "Umum" ? "Layanan Pelanggan" : "Layanan Verifikasi" }),
          ...(userid && { assigned: userid }), // Adds `assigned` condition if `userid` is provided
        },
      });

      data = data.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt.split(' ')[0].split('-').reverse().join('-') + 'T' + a.createdAt.split(' ')[1]).getTime();
        const dateB = new Date(b.createdAt.split(' ')[0].split('-').reverse().join('-') + 'T' + b.createdAt.split(' ')[1]).getTime();
        return dateA - dateB;
      });
    } else {
      // Fetch all records from the Antrian table if `bydate` is not set to true
      data = await prisma.antrian.findMany();
    }

    // Return the fetched data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Antrian data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const {
      antrianID,
      userID,
      statusAntrian,
      operation,
    } = await request.json();

    const jakartaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    const dateOnly = format(new Date(jakartaTime), 'dd-MM-yyyy', { locale: localeID });
    const updatedAt = format(new Date(jakartaTime), 'dd-MM-yyyy HH:mm:ss', { locale: localeID });

    // Ensure required fields are present
    if (!antrianID || !userID || statusAntrian === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Conditional logic based on the `operation` value
    if (operation === 'Ambil') {
      // Check if the user already has a ticket in progress for today
      const existingProgressTicket = await prisma.antrian.findFirst({
        where: {
          assigned: userID,
          statusAntrian: "Progress",
          createdAt: {
            startsWith: dateOnly, // Check if the ticket's `createdAt` date matches today's date
          },
        },
      });

      // If a ticket is found, prevent the update
      if (existingProgressTicket) {
        return NextResponse.json(
          { error: 'Tidak bisa mengambil tiket ketika ada tiket yang sedang dikerjakan.' },
          { status: 400 }
        );
      }

      // Set the status to "Progress"
      await prisma.antrian.update({
        where: { id: antrianID },
        data: {
          assigned: userID,
          statusAntrian: statusAntrian,
          updatedAt,
        },
      });
    } else if (operation === 'Selesai') {
      // Directly update status to "Closed" without validation
      await prisma.antrian.update({
        where: { id: antrianID },
        data: {
          assigned: userID,
          statusAntrian: statusAntrian,
          updatedAt,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid operation type' },
        { status: 400 }
      );
    }

    // Return a successful response
    return NextResponse.json({ message: 'Antrian updated successfully' });
  } catch (error) {
    console.error('Error updating Antrian:', error);
    return NextResponse.json({ error: 'Failed to update Antrian' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      layanan,
      kategoriLayanan,
      statusAntrian,
    } = await request.json();

    // Get Jakarta time as a string in 'dd-MM-yyyy HH:mm:ss' format
    const jakartaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    const createdAt = format(new Date(jakartaTime), 'dd-MM-yyyy HH:mm:ss', { locale: localeID });

    // Extract date-only portion for filtering (e.g., '30-10-2024')
    const dateOnly = format(new Date(jakartaTime), 'dd-MM-yyyy', { locale: localeID });

    // Count existing entries that match the same `dateOnly`
    const countForDate = await prisma.antrian.count({
      where: {
        createdAt: {
          startsWith: dateOnly, // Check if createdAt starts with the same date
        },
        layanan: layanan
      },
    });

    const nomorAntrian = `${countForDate + 1}`;

    // Create a new record in the Antrian model
    const newAntrian = await prisma.antrian.create({
      data: {
        nomorAntrian,
        layanan,
        kategoriLayanan,
        createdAt,
        statusAntrian,
      },
    });

    return NextResponse.json(newAntrian.nomorAntrian, { status: 201 });
  } catch (error) {
    console.error('Error creating Antrian:', error);
    return NextResponse.json({ error: 'Failed to create Antrian' }, { status: 500 });
  }
}
