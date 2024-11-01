import React from 'react'

import { useQuery } from 'react-query'
import axios from 'axios'

import TableProses from './TableProses'
import TableAntrian from './TableAntrian'

import { userID } from '@/types/types';

import { toast } from 'react-toastify';

import FullScreenLoader from '@/components/shared/FullScreenLoader'

type Session = {
  id: string
  name: string
  type: string
}

type Props = {
  session?: Session
}

function Index({ session }: Props) {
  const fetchServices = async () => {
    const { data } = await axios.get(`api/antrian`, {
      params: { 
        bydate: true,
        type: session?.type 
      },
    });
    return data;
  };
  
  const fetchProses = async () => {
    const { data } = await axios.get(`api/antrian`, {
      params: { 
        bydate: true,
        userid: session?.id
      },
    });
    return data;
  };

  // Fetch services with caching
  const { data: serviceData, error: serviceError, isLoading: isServiceLoading, refetch: refetchServices } = useQuery(
    'serviceData',
    fetchServices,
    {
      onError: (error: any) => {
        toast.error(`Error loading service data: ${error.message}`);
      },
    }
  );

  // Fetch proses with caching and conditional fetching
  const { data: prosesData, error: prosesError, isLoading: isProsesLoading, refetch: refetchProses } = useQuery(
    ['prosesData'],
    () => fetchProses(),
    {
      enabled: !!userID,  // Only fetch when `userID` is defined
      onError: (error: any) => {
        toast.error(`Error loading proses data: ${error.message}`);
      },
    }
  );

  const handleRefecth = () => {
    refetchProses()
    refetchServices()
  }

  if (isServiceLoading || isProsesLoading) return <FullScreenLoader />;
  if (serviceError || prosesError) return <div>Error loading data</div>;

  return (
    <div className='w-full h-full grid grid-cols-3 gap-6 px-16 py-8 pt-12'>
      <TableProses session={session} data={prosesData} refetch={handleRefecth} />
      <TableAntrian session={session} data={serviceData} refetch={handleRefecth} />
    </div>
  )
}

export default Index