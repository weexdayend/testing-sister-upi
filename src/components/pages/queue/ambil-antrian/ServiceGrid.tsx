import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeftIcon } from 'lucide-react';

interface ServiceGridProps {
  selectedLayanan: string;
  setSelectedService: (service: string) => void;
  back: () => void;
}

type ServiceItem = {
  title: string;
  description: string;
};

type ServiceCategories = {
  [key: string]: ServiceItem[];
};

const services: ServiceCategories = {
  "Layanan Pelanggan": [
    { title: 'Informasi Pelatihan / Kursus', description: 'Details about available training and courses.' },
    { title: 'Informasi Tes', description: 'Information regarding upcoming tests and requirements.' },
    { title: 'Informasi Validasi Akun Member', description: 'Account validation process and requirements.' },
    { title: 'Pengambilan Sertifikat', description: 'Instructions for collecting certificates.' },
    { title: 'Informasi Umum', description: 'General information and support.' }
  ],
  "Layanan Verifikasi": [
    { title: 'Layanan Verifikasi', description: 'Verification services available for all members.' }
  ]
};

const ServiceGrid: React.FC<ServiceGridProps> = ({ selectedLayanan, setSelectedService, back }) => {
  const containerRef = useRef<(HTMLDivElement | null)>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({defaults: {
      duration: 0.5,
      ease:  'power3.inOut'
    }} )
    tl.fromTo(serviceRefs.current, 
      { y: 25 }, 
      { opacity: 1, y: 0, stagger: 0.2 }
    );
  }, [selectedLayanan]);

  const selectedServices = services[selectedLayanan] || [];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-[70rem]">
      <div
        className="bg-white flex flex-col w-full px-8 py-12 items-center rounded-3xl shadow-lg shadow-blue-200/20
          transition-all ease-in active:scale-95 cursor-pointer text-center"
        onClick={back}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeftIcon size={32} className="text-rose-600" />
            <h1 className="text-xl text-rose-600">Kembali</h1>
          </div>
        </div>
      </div>

      {selectedServices.map((service, index) => (
        <div
          key={index}
          ref={(el) => {
            serviceRefs.current[index] = el;
          }}
          className="opacity-0 bg-stone-700 flex flex-col w-full px-8 py-12 items-center rounded-3xl shadow-lg shadow-blue-200/20
            transition-all ease-in active:scale-95 cursor-pointer text-center"
          onClick={() => setSelectedService(service.title)}
        >
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-xl font-bold text-neutral-50">{service.title}</h1>
            <p className="text-sm text-neutral-50">{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;