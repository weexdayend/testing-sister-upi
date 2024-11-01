import React from 'react'

type Antrian = {
  userId: string
  assigned: string
  nomorAntrian: string | null
}

type Props = {
  data: Antrian[]
}

const images = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', 
  'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', 
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5', 
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
];

function TopSection({ data }: Props) {
  return (
    <div className='w-full h-full grid grid-cols-3 gap-8'>
      {
        data.length > 0 ? (
          <div className='bg-stone-700 h-full text-neutral-50 flex flex-col px-6 py-6 gap-6 items-center rounded-xl'>
            <div className='flex flex-col w-full h-full text-center justify-between'>
              <h1 className="text-sm">Panggilan Antrian Nomor</h1>
              <h1 className='text-6xl font-bold'>{data[0].nomorAntrian}</h1>
              <h1 className='text-4xl font-bold'>{data[0].assigned}</h1>
            </div>
          </div>
        ) : (
          <div className='bg-stone-700 text-neutral-50 flex flex-col px-6 py-6 items-center rounded-xl'>
            <div className='w-full h-full flex flex-col items-center justify-center text-center'>
              <h1>Belum ada Nomor Antrian yang dipanggil, mohon untuk menggu, terima kasih.</h1>
            </div>
          </div>
        )
      }

      <div className="col-span-2 relative w-full h-full overflow-hidden rounded-xl">
        <div className="flex animate-scroll">
          {images.concat(images).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Carousel image ${index}`}
              className="w-full h-[300px] object-cover"
              style={{ minWidth: "100%" }} // Ensures each image takes up full width
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopSection