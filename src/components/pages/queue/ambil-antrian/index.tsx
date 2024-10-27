import React, { useState } from 'react'

import { motion } from 'framer-motion';

import ImagePelanggan from '@/app/images/layanan-pelanggan.png'
import ImageVerifikasi from '@/app/images/layanan-verifikasi.png'

import Image, { StaticImageData } from 'next/image'

type Step = 1 | 2 | 3;

type ServiceCardProps = {
  title: string;
  description: string;
  imageSrc: StaticImageData;
  onClick: () => void;
};

async function connectToBluetoothDevice() {
  if (!navigator.bluetooth) {
    console.error("Web Bluetooth is not supported on this browser.");
    alert("Web Bluetooth is not supported on this browser.");
    return;
  }
  
  try {
    // Define the UUIDs of the services you want to access
    const serviceUUIDs = [
      '18F0', // Replace with your actual service UUIDs
      'E7810A71-73AE-499D-8C15-FAA0AEF0CF2'
    ];

    // Request a Bluetooth device with the specified service UUIDs
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: serviceUUIDs }]
    });

    console.log('Device selected:', device);

    // Check if the GATT server is available
    if (!device.gatt) {
      throw new Error("GATT server not available on this device.");
    }

    // Connect to the GATT server
    const server = await device.gatt.connect();
    console.log('Connected to GATT server:', server);

    // Get the primary services
    const services = await server.getPrimaryServices();
    services.forEach(service => console.log("Available service UUID:", service.uuid));
    
    return services;
  } catch (error) {
    console.error("Error reading device info:", error);
  }
}


function ServiceCard({ title, description, imageSrc, onClick }: ServiceCardProps) {
  return (
    <div
      className="
        bg-white flex flex-col w-full h-[360px] px-6 py-6 items-center rounded-3xl shadow-lg shadow-blue-500/10
        transition-all ease-in active:scale-95 cursor-pointer
      "
      onClick={onClick}
    >
      <div className="flex flex-col justify-between gap-4 h-full">
        <div className="flex items-center justify-center h-[55%]">
          <Image alt={`${title} image`} src={imageSrc} width={250} height={250} className="object-contain" />
        </div>
        <div className="flex flex-col max-w-[25rem] gap-2 p-4 h-[45%] overflow-hidden text-center">
          <h1 className="text-xl font-bold text-stone-950">{title}</h1>
          <p className="text-sm text-stone-950/70">{description}</p>
        </div>
      </div>
    </div>
  );
}


function Index() {
  const [step, setStep] = useState<Step>(1); // Track the current step
  const [selectedLayanan, setSelectedLayanan] = useState<string | null>(null); // Store selected service

  const handleNext = () => {
    if (step < 3) setStep((prevStep) => (prevStep + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((prevStep) => (prevStep - 1) as Step);
  };

  const variants = {
    initial: { opacity: 0, y: 50 }, // Start 50px below
    animate: { opacity: 1, y: 0 }, // End in default position
    exit: { opacity: 0, y: 50 }     // Slide down 50px when exiting
  };

  async function handlePrint() {
    await connectToBluetoothDevice();
  }

  return (
    <div className="min-w-[50rem] flex flex-col gap-8">
      {step === 1 && (
        <motion.div
          key="step1"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
          className="flex flex-row gap-8"
        >
          {/* Step 1: Choose Layanan */}
          <motion.div
            variants={variants}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <ServiceCard
              title="Layanan Pelanggan"
              description="Untuk keperluan umum, seperti pertanyaan atau bantuan. Dapatkan layanan cepat dan mudah untuk semua kebutuhan Anda."
              imageSrc={ImagePelanggan}
              onClick={() => {
                setSelectedLayanan('pelanggan');
                handleNext();
              }}
            />
          </motion.div>

          <motion.div
            variants={variants}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ServiceCard
              title="Layanan Verifikasi"
              description="Verifikasi data Anda dengan mudah dan aman. Pilih layanan ini jika Anda perlu melakukan validasi informasi atau dokumen."
              imageSrc={ImageVerifikasi}
              onClick={() => {
                setSelectedLayanan('verifikasi');
                handleNext();
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          key="step2"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-xl font-bold">Pilih Detail Layanan - {selectedLayanan}</h1>
          {/* Additional form fields specific to layanan */}
          <button onClick={handleNext} className="px-4 py-2 bg-indigo-500 text-white rounded-lg">
            Next to Print Queue
          </button>
          <button onClick={handleBack} className="mt-2 text-indigo-500">
            Back
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="step3"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-xl font-bold">Print Queue</h1>
          <p>Your selected service: {selectedLayanan}</p>
          {/* Show print button or any other final action */}
          <button onClick={handlePrint} className="px-4 py-2 bg-green-500 text-white rounded-lg">Print Queue</button>
          <button onClick={handleBack} className="mt-2 text-indigo-500">
            Back
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default Index