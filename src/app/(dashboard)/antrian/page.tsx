'use client'

import React, { useEffect } from 'react'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { QueryClient, QueryClientProvider } from 'react-query'

import Index from '@/components/pages/dashboard/antrian'
import FullScreenLoader from '@/components/shared/FullScreenLoader';

const queryClient = new QueryClient();

type Props = {}

function Page({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect if not logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return <FullScreenLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <section
        className='min-w-screen min-h-screen flex flex-col gap-6 px-6 py-6 relative overflow-hidden'
      >
        <Index session={session?.user} />
      </section>
    </QueryClientProvider>
  )
}

export default Page