import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap';

import { Skeleton } from '@/components/ui/skeleton'

type Antrian = {
  userId: string
  userName: string
  nomorAntrian: string | null
  type: 'Umum' | 'Verifikasi';
}

type Props = {
  data: Antrian[]
}

function BottomSection({ data }: Props) {
  const [chunks, setChunks] = useState<Antrian[][]>([]); // Store chunks of data
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline({ repeat: -1, delay: 1 }));

  useEffect(() => {
    setIsLoading(true);

    // Split data into chunks of 3 items, handling 'Verifikasi' items individually
    const tempChunks: Antrian[][] = [];
    let chunk: Antrian[] = [];

    data.forEach((item) => {
      if (item.type === 'Verifikasi') {
        tempChunks.push([item]);
      } else {
        chunk.push(item);
        if (chunk.length === 3) {
          tempChunks.push(chunk);
          chunk = [];
        }
      }
    });
    if (chunk.length) tempChunks.push(chunk);

    setChunks(tempChunks); // Set chunks in state
    setIsLoading(false);

    // GSAP animation setup
    tl.current.clear();
    tl.current
      .to(carouselRef.current, { opacity: 0, duration: 0.5 })
      .call(() => {
        setCurrentChunkIndex((index) => (index + 1) % tempChunks.length);
      })
      .to(carouselRef.current, { opacity: 1, duration: 0.5 })
      .to({}, { duration: 10 })
      .repeat(-1);
  }, [data]);

  const renderChunk = () => {
    const chunk = chunks[currentChunkIndex] || [];
    return chunk.map((item, idx) => (
      <div key={idx} className="bg-yellow-400 text-stone-950 px-6 py-6 flex flex-col items-center justify-center border rounded-xl w-full">
        <h1 className="text-sm">{item.userName}</h1>
        <h1 className="text-6xl font-bold">{item.nomorAntrian ? item.nomorAntrian : '-'}</h1>
      </div>
    ));
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div ref={carouselRef} className="w-full flex gap-8">
        {isLoading ? (
          <div className="w-full flex gap-8">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="w-full bg-white px-6 py-6 flex flex-col items-center justify-center border rounded-xl">
                <Skeleton className="w-16 h-4 mb-2" /> {/* Skeleton for userName */}
                <Skeleton className="w-24 h-10" /> {/* Skeleton for nomorAntrian */}
              </div>
            ))}
          </div>
        ) : (
          renderChunk()
        )}
      </div>
    </div>
  )
}

export default BottomSection