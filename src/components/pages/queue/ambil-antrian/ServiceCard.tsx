import React from 'react'

import Image, { StaticImageData } from 'next/image'

type ServiceCardProps = {
  title: string;
  description: string;
  imageSrc: StaticImageData;
  onClick: () => void;
};

function ServiceCard({ title, description, imageSrc, onClick }: ServiceCardProps) {
  return (
    <div
      className="
        bg-stone-700 flex flex-col w-full h-[360px] px-6 py-8 items-center rounded-3xl text-neutral-50
        transition-all ease-in active:scale-95 cursor-pointer
      "
      onClick={onClick}
    >
      <div className="flex flex-col justify-between gap-4 h-full">
        <div className="flex items-center justify-center h-[55%]">
          <Image alt={`${title} image`} src={imageSrc} width={250} height={250} className="object-contain" />
        </div>
        <div className="flex flex-col max-w-[25rem] gap-2 p-4 h-[45%] overflow-hidden text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard