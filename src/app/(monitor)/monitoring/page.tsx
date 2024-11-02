'use client'

import React, { useState, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query'

import Image from 'next/image'

import Logo from '@/app/images/logo.png'
import Background from '@/app/images/bauhaus-background.svg'

import Index from '@/components/pages/monitor'

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
        className='min-w-screen min-h-screen flex flex-col gap-6 py-6 items-center relative overflow-hidden'
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

        <div className="w-full h-fit absolute flex flex-row items-center justify-between top-0 px-16">
          <div className='bg-white px-8 py-8 rounded-sm z-50'>
            <Image
              src={Logo}
              alt="Logo"
              width={200} // Adjust size as needed
              height={200}
              className="object-contain opacity-80"
            />
          </div>
          <div className='flex flex-col text-right'>
            <h1 className='text-lg'>{currentDate}</h1>
            <h1 className="text-lg">{currentTime}</h1>
          </div>
        </div>

        <Index />

        <div className="w-full h-fit absolute flex flex-col bottom-6 px-16">
          <div className='bg-white border w-full h-fit py-2 rounded-l-sm overflow-hidden'>
            <div className="whitespace-nowrap animate-marquee">
              <span className="px-4 text-stone-950">Pusat Bahasa UPI bertujuan untuk menjadi pusat keunggulan dalam studi dan layanan bahasa baik di tingkat nasional maupun internasional.</span>
            </div>
          </div>
        </div>
      </section>
    </QueryClientProvider>
  )
}

export default Page