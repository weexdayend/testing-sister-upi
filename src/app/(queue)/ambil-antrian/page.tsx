'use client'

import React from 'react'

import { QueryClient, QueryClientProvider } from 'react-query'

import Image from 'next/image'

import Logo from '@/app/images/logo-upi.png'
import Background from '@/app/images/bauhaus-background.svg'
import BackgroundSecond from '@/app/images/bauhasu-background-second.svg'

import Index from '@/components/pages/queue/ambil-antrian'

type Props = {}

const queryClient = new QueryClient();

function Page({}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <section
        className='min-w-screen min-h-screen flex flex-col gap-6 px-6 py-6 items-center justify-center relative overflow-hidden'
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
            width={250} // Adjust size as needed
            height={250}
            className="object-contain opacity-80"
          />
        </div>
      </section>
    </QueryClientProvider>
  )
}

export default Page