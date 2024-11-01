import React, { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"

import { toast } from 'react-toastify';
import { Layanan } from '@/types/types';

type Session = {
  id: string
  name: string
  type: string
}

type Props = {
  session?: Session
  data: Layanan[]
  refetch: () => void
}

function TableProses({ session, data, refetch }: Props) {
  const [panggil, setPanggil] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPanggil(false)
    }, 10000);
  
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [panggil]);

  const handlePanggil = async (nomor: string) => {
    setPanggil(true)

    // const queueText = `Nomor Antrian: ${nomor}, ke loket 3`; // Text to be spoken

    // // Use Web Speech API for TTS
    // const utterance = new SpeechSynthesisUtterance(queueText);
    // utterance.lang = 'id-ID'; // Set language to Indonesian

    // // Adjust rate and pitch for slower and clearer speech
    // utterance.rate = 0.7; // Default is 1, set to lower for slower speech
    // utterance.pitch = 0.5; // Default is 1, you can adjust for different tonalities

    // // Speak the queue number
    // window.speechSynthesis.speak(utterance);

    toast.promise(
      (async () => {
        const response = await fetch(`/api/panggilan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomorAntrian: nomor, assigned: session?.name, statusPanggilan: false }),
        });
  
        // If response is not ok, throw error to trigger catch block
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create Panggilan');
        }
  
        const data = await response.json();
        console.log('Panggilan created successfully:', data);
  
        return data;
      })(),
      {
        pending: 'Memanggil Antrian...',
        success: 'Panggilan antrian berhasil dibuat, mohon tunggu.',
        error: {
          render({ data }: any) {
            return data.message || 'Failed to create Panggilan. Please try again.';
          }
        }
      }
    );
  }

  const handleProses = async (antrianID: string) => {
    toast.promise(
      (async () => {
        const response = await fetch(`/api/antrian`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ antrianID, userID: session?.id, statusAntrian: "Closed", operation: "Selesai" }),
        });
  
        // If response is not ok, throw error to trigger catch block
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update Antrian');
        }
  
        const data = await response.json();
        console.log('Antrian updated successfully:', data);
  
        // Optionally refetch or update the UI
        refetch();
  
        return data;
      })(),
      {
        pending: 'Menyelesaikan Antrian...',
        success: 'Antrian berhasil diselesaikan, Teria kasih.',
        error: {
          render({ data }: any) {
            return data.message || 'Failed to update Antrian. Please try again.';
          }
        }
      }
    );
  };

  return (
    <div className="w-full h-fit">
      {
        data.length > 0 ? (
        <div className='w-full h-full flex'>
          {
            data.map((item: any, index: number) => (
              <div key={index} className='w-full flex flex-col gap-4'>
                <div className='bg-yellow-400 w-full flex flex-col gap-4 border rounded-xl px-4 py-4'>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-sm text-stone-950'>Nomor Antrian</h1>
                    <h1 className='text-6xl text-stone-950 font-bold'>{item.nomorAntrian}</h1>
                  </div>

                  <div className='w-full flex flex-row items-center justify-between'>
                    <div className='flex flex-col'>
                      <h1 className='text-xs text-stone-950/70'>Layanan</h1>
                      <h1 className='text-sm text-stone-950 font-bold'>{item.layanan}</h1>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className='text-xs text-stone-950/70'>Kategori</h1>
                      <h1 className='text-sm text-stone-950 font-bold'>{item.kategoriLayanan}</h1>
                    </div>
                  </div>
                </div>

                <div className='w-full flex flex-row items-center justify-between gap-4'>
                  <Button
                    onClick={() => handlePanggil(item.nomorAntrian)} 
                    className='w-full bg-white border-stone-950 text-stone-950 hover:text-stone-950 hover:bg-white'
                    disabled={panggil}
                  >
                    Panggil
                  </Button>
                  <Button className='w-full' onClick={() => handleProses(item.id)}>Selesai</Button>
                </div>
              </div>
            ))
          }
        </div>
        ) : (
        <div className='w-full h-full flex ites-center justify-center px-4 py-12 border rounded-md'>
          Belum ada antrian yang diproses.
        </div>
        )
      }
    </div>
  )
}

export default TableProses