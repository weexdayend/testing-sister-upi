'use client'

import React, { useState, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query'

import Image from 'next/image'

import Logo from '@/app/images/logo.png'
import Background from '@/app/images/bauhaus-background.svg'

import Index from '@/components/pages/queue/ambil-antrian'

const queryClient = new QueryClient();

function Page() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = now.toLocaleDateString('id-ID', dateOptions);

      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const formattedTime = now.toLocaleTimeString('id-ID', timeOptions);

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    // Update the date and time every second
    const timer = setInterval(updateDateTime, 1000);

    // Call once immediately to set initial date/time
    updateDateTime();

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <section
        className='min-w-screen min-h-screen flex flex-col gap-6 px-6 py-6 items-center relative overflow-hidden'
      >
        <div className="absolute w-[50vw] h-full bottom-0 left-0 -z-50">
          {/* Image */}
          <Image
            src={Background}
            alt="Background"
            className="h-full w-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/30 via-white/80 to-white"></div>
        </div>

        <Index />

        <div className="absolute bottom-6 right-6 z-10">
          <Image
            src={Logo}
            alt="Logo"
            width={300} // Adjust size as needed
            height={300}
            className="object-contain opacity-80"
          />
        </div>
      </section>
    </QueryClientProvider>
  )
}

export default Page