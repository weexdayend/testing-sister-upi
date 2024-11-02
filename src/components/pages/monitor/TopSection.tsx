import React from 'react'

type Antrian = {
  userId: string
  assigned: string
  nomorAntrian: string | null
}

type Props = {
  data: Antrian[]
}

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

function TopSection({ data }: Props) {
  return (
    <div className='w-full h-full grid grid-cols-3 gap-8'>
      {
        data.length > 0 ? (
          <div className='bg-stone-600 h-full text-neutral-50 flex flex-col px-6 py-6 gap-6 items-center rounded-xl'>
            <div className='flex flex-col w-full h-full text-center justify-between'>
              <h1 className="text-sm">Panggilan Antrian Nomor</h1>
              <h1 className='text-6xl font-bold'>{data[0].nomorAntrian}</h1>
              <h1 className='text-4xl font-bold'>{data[0].assigned}</h1>
            </div>
          </div>
        ) : (
          <div className='bg-stone-600 text-neutral-50 flex flex-col px-6 py-6 items-center rounded-xl'>
            <div className='w-full h-full flex flex-col items-center justify-center text-center'>
              <h1>Belum ada Nomor Antrian yang dipanggil, mohon untuk menggu, terima kasih.</h1>
            </div>
          </div>
        )
      }

      <div className="col-span-2 relative w-full max-h-[400px] overflow-hidden rounded-xl">
        <video
          className="w-full h-full object-cover"
          src="https://res.cloudinary.com/dlwkuj99d/video/upload/v1730475566/wknthnqobzdvb3wx7xhm.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  )
}

export default TopSection