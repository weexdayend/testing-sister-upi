'use client'

import React from 'react'

import { QueryClient, QueryClientProvider } from 'react-query'

import Image from 'next/image'

import Logo from '@/app/images/logo.png'
import Background from '@/app/images/bauhaus-background.svg'

import Index from '@/components/pages/monitor'

const queryClient = new QueryClient();

function Page() {
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

        <div className='bg-white w-full px-8 py-2 rounded-md border relative overflow-hidden'>
          <div className="whitespace-nowrap animate-marquee">
            <span className="px-4 text-stone-950">Pusat Bahasa UPI bertujuan untuk menjadi pusat keunggulan dalam studi dan layanan bahasa baik di tingkat nasional maupun internasional.</span>
            {/* Add more spans as needed */}
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-10 bg-white px-4 py-4 border">
          <Image
            src={Logo}
            alt="Logo"
            width={200} // Adjust size as needed
            height={200}
            className="object-contain opacity-80"
          />
        </div>
      </section>
    </QueryClientProvider>
  )
}

export default Page