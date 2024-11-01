import React, { useState, useEffect } from 'react'
import TopSection from './TopSection'
import BottomSection from './BottomSection'

type Antrian = {
  userId: string
  userName: string
  nomorAntrian: string | null
  type: 'Umum' | 'Verifikasi';
}

function initializeEventSource(url: string, onMessage: (data: any) => void) {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    onMessage(parsedData);
  };

  eventSource.onerror = () => {
    console.error(`Error connecting to ${url}`);
    eventSource.close(); // Close the connection on error to avoid memory leaks.
  };

  return eventSource;
}

function Index({}) {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const [dataMonitoring, setDataMonitoring] = useState<Antrian[]>([])
  const [dataPanggilan, setDataPanggilan] = useState<any[]>([])

  useEffect(() => {
    // Initialize the event sources for both data streams
    const antrianEventSource = initializeEventSource('/api/monitoring', setDataMonitoring);
    const panggilanEventSource = initializeEventSource('/api/panggilan', setDataPanggilan);

    // Cleanup on component unmount
    return () => {
      antrianEventSource.close();
      panggilanEventSource.close();
    };
  }, []);

  const executePanggilan = () => {
    if (dataPanggilan.length > 0 && window.speechSynthesis) {
      let index = 0;
  
      const speakNext = () => {
        if (index >= dataPanggilan.length) return; // Stop if all messages have been spoken
  
        const panggilan = dataPanggilan[index];
        const { id, nomorAntrian: nomor, assigned: loket } = panggilan;
  
        if (nomor && loket) {
          const queueText = `Nomor Antrian: ${nomor}, ke ${loket}`;
          const utterance = new SpeechSynthesisUtterance(queueText);
          utterance.lang = 'id-ID';
          utterance.rate = 0.5;
          utterance.pitch = 0.5;
  
          // When the utterance finishes, move to the next item and send the update after a delay
          utterance.onend = () => {
            // Update status in backend
            fetch(`/api/panggilan`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, statusPanggilan: true }),
            })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Error updating status for ID ${id}`);
              }
              index += 1; // Move to the next item
              
              // Add a delay before queuing the next utterance
              setTimeout(speakNext, 5000); // Adjust delay (1000 ms) as needed
            })
            .catch((error) => console.error('Error updating status:', error));
          };
  
          // Speak the current message
          window.speechSynthesis.speak(utterance);
        } else {
          console.warn(`Data missing for panggilan entry: ${JSON.stringify(panggilan)}`);
          index += 1; // Move to the next item if data is incomplete
          setTimeout(speakNext, 1000); // Delay before next utterance in case of missing data
        }
      };
  
      // Start the first utterance
      speakNext();
    } else {
      console.warn('Speech synthesis not supported or no data to process');
    }
  };  

  const enableAudio = () => {
    setAudioEnabled(true);
    executePanggilan();
  };
  
  // Automatically call executePanggilan when dataPanggilan changes
  useEffect(() => {
    if (audioEnabled && dataPanggilan.length > 0) {
      executePanggilan();
    }
  }, [audioEnabled, dataPanggilan]);

  return (
    <div className='w-full h-full flex flex-col items-center gap-6 px-16 py-8 pt-12'>
      {!audioEnabled && (
        <button onClick={enableAudio}>Enable Queue Announcements</button>
      )}
      <TopSection data={dataPanggilan} />
      <BottomSection data={dataMonitoring} />
    </div>
  )
}

export default Index