import React, { useEffect, useState } from 'react'

import { motion } from 'framer-motion';

import ImagePelanggan from '@/app/images/layanan-pelanggan.png'
import ImageVerifikasi from '@/app/images/layanan-verifikasi.png'

import ServiceCard from './ServiceCard';
import ServiceGrid from './ServiceGrid';
import { CheckCircle2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Step = 1 | 2 | 3;

// Update these UUIDs as per rpp02n's specifications
const SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455"; // e.g., "printer_service"
const CHARACTERISTIC_UUID = "49535343-8841-43f4-a8d4-ecbe34729bb3"; // e.g., "print_characteristic"

function Index() {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [status, setStatus] = useState("Disconnected");
  const [printerCharacteristic, setPrinterCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  async function requestBluetoothDevice() {
    try {
      setStatus("Requesting Bluetooth device...");
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: "RPP02N" }], // Filters for devices with name "rpp02n"
        optionalServices: [SERVICE_UUID],
      });

      setDevice(selectedDevice);
      setStatus(`Connected to ${selectedDevice.name || "Unnamed device"}`);
      
      const server = await selectedDevice.gatt?.connect();
      if (server) {
        setStatus("Connected to GATT server");
        
        const service = await server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
        
        setPrinterCharacteristic(characteristic);
        setStatus("Printer characteristic found");
        
        selectedDevice.addEventListener("gattserverdisconnected", onDisconnected);
      } else {
        setStatus("Connection failed");
      }
    } catch (error) {
      console.error("Bluetooth pairing failed:", error);
      setStatus("Failed to connect");
    }
  }

  function onDisconnected() {
    setDevice(null);
    setStatus("Device disconnected");
    setPrinterCharacteristic(null);
  }

  async function sendPrintCommand(nomor: string) {
    if (!printerCharacteristic) {
      console.error("No printer characteristic available");
      setStatus("Printer characteristic not available");
      return;
    }
    try {
      // Get current date and time in Asia/Jakarta time zone
      const now = new Date();
      const dateFormatter = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
      });
      const timeFormatter = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      });
      
      const date = dateFormatter.format(now); // Format as DD/MM/YYYY
      const time = timeFormatter.format(now); // Format as HH:MM

      // Normal size for "Layanan Pelanggan"
      const layananText = `\x1b\x61\x01\x1b\x21\x00${selectedLayanan}:\n`;
      const serviceText = `\x1b\x61\x01\x1b\x21\x00${selectedKategoriLayanan}\n\n\n`;
      
      // Larger font for "Nomor 001LP"
      const NomorAntrian = `\x1b\x21\x11\x1d\x21\x33${nomor}\n\n\n`;
      
      // Add date and time in normal size
      const dateTimeText = `\x1b\x61\x01\x1b\x21\x00${date} ${time}\n\n\n`;

      const CopyrightText1 = `\x1b\x45\x01\x1b\x21\x00Balai Bahasa\n\x1b\x45\x00\n`;
      const CopyrightText2 = `\x1b\x45\x01\x1b\x21\x00Universitas Pendidikan Indonesia\n\x1b\x45\x00`;

      // Combine all text data
      const printData =  dateTimeText + NomorAntrian + layananText + serviceText  + CopyrightText1 + CopyrightText2;
  
      const encoder = new TextEncoder();
      const datas = encoder.encode(printData);
      await printerCharacteristic.writeValue(datas);
      setStatus("Print command sent successfully");
    } catch (error) {
      console.error("Failed to send print command:", error);
      setStatus("Failed to send print command");
    }
  }

  const [step, setStep] = useState<Step>(1);
  const [selectedLayanan, setSelectedLayanan] = useState<string>("");
  const [selectedKategoriLayanan, setSelectedKategoriLayanan] = useState<string>("");

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

  const postAntrian = async () => {
    const response = await fetch('/api/antrian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        layanan: selectedLayanan,
        kategoriLayanan: selectedKategoriLayanan,
        statusAntrian: 'Open',
      }),
    });
    const data = await response.json();
    if (data) {
      sendPrintCommand(data)
    }
  };

  useEffect(() => {
    // Check if the step is 3 to trigger postAntrian
    if (step === 3) {
      postAntrian();

      // Set a timeout to reset step back to 1 after 5 seconds
      const timeoutId = setTimeout(() => {
        setStep(1);
        setSelectedLayanan("")
        setSelectedKategoriLayanan("")
      }, 5000); // 5000 ms = 5 seconds

      // Cleanup the timeout if component unmounts or step changes
      return () => clearTimeout(timeoutId);
    }
  }, [step]);

  return (
    <div className="min-w-[50rem] flex flex-col gap-8 pt-24">
      {
        printerCharacteristic === null && (
          <div className='flex flex-col px-4 py-2 bg-white rounded-xl border'>
            <h1 className='text-2xl'>{status}</h1>
            <Button onClick={requestBluetoothDevice}>
              {device ? "Reconnect" : "Find and Pair Bluetooth Device"}
            </Button>
          </div>
        )
      }

      {step === 1 && (
        <>
          <motion.div
            key="step1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-8"
          >
            <div className='col-span-2 flex flex-col px-6 py-6 bg-white border rounded-xl text-center'>
              <h1 className='text-2xl'>Ambil nomor antrianmu di sini, dan pilih layanan yang kamu butuhkan.</h1>
            </div>
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
                  setSelectedLayanan('Layanan Pelanggan');
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
                  setSelectedLayanan('Layanan Verifikasi');
                  handleNext();
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}

      {step === 2 && (
        <div
          key="step2"
          className="flex flex-col items-center gap-12"
        >
          <ServiceGrid 
            selectedLayanan={selectedLayanan} 
            setSelectedService={(e) => {
              setSelectedKategoriLayanan(e)
              handleNext();
            }} // Pass the callback
            back={handleBack}
          />
        </div>
      )}

      {step === 3 && (
        <motion.div
          key="step3"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 pt-40"
        >
          <div className="bg-stone-700 flex flex-row w-fit gap-12 px-6 py-8 items-center justify-between rounded-3xl text-neutral-50">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">Terima kasih telah menggunakan layanan kami,</h1>
              <p>Silahkan ambil nomor antrian anda.</p>
            </div>
            <CheckCircle2Icon className='w-12 h-12 text-white' />
            {/* Show print button or any other final action */}
            {/* <button onClick={postAntrian} className="px-4 py-2 bg-green-500 text-white rounded-lg">
              Print Queue
            </button>
            <button onClick={handleBack} className="mt-2 text-indigo-500">
              Back
            </button> */}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Index