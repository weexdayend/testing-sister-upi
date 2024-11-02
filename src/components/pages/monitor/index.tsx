import React, { useState, useEffect, useCallback } from 'react';

import { useQuery } from 'react-query';
import axios from 'axios';

import TopSection from './TopSection';
import BottomSection from './BottomSection';

function Index() {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const fetchData = async () => {
    const [monitoring, panggilan] = await Promise.all([
      axios.get(`api/monitoring`),
      axios.get(`api/panggilan`),
    ]);
    return { monitoringData: monitoring.data, panggilanData: panggilan.data };
  };

  const { data, error, isLoading } = useQuery('fetchData', fetchData, {
    refetchInterval: 5000,
    refetchOnWindowFocus: false
  });
  const { monitoringData, panggilanData } = data || {};

  const executePanggilan = useCallback(() => {
    if (panggilanData?.length > 0 && window.speechSynthesis) {
      let index = 0;

      const speakNext = () => {
        if (index >= panggilanData.length) return;

        const panggilan = panggilanData[index];
        const { id, nomorAntrian: nomor, assigned: loket } = panggilan;

        if (nomor && loket) {
          const queueText = `Nomor Antrian: ${nomor}, ke ${loket}`;
          const utterance = new SpeechSynthesisUtterance(queueText);
          utterance.lang = 'id-ID';
          utterance.rate = 0.5;
          utterance.pitch = 0.5;

          utterance.onend = () => {
            fetch(`/api/panggilan`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, statusPanggilan: true }),
            })
            .then((response) => {
              if (!response.ok) throw new Error(`Error updating status for ID ${id}`);
              index += 1;
              setTimeout(speakNext, 5000);
            })
            .catch((error) => console.error('Error updating status:', error));
          };

          window.speechSynthesis.speak(utterance);
        } else {
          console.warn(`Data missing for panggilan entry: ${JSON.stringify(panggilan)}`);
          index += 1;
          setTimeout(speakNext, 1000);
        }
      };

      speakNext();
    } else {
      console.warn('Speech synthesis not supported or no data to process');
    }
  }, [panggilanData]);

  const enableAudio = () => {
    setAudioEnabled(true);
  };

  // Only trigger executePanggilan when audio is enabled
  useEffect(() => {
    if (audioEnabled) {
      executePanggilan();
    } else {
      const userConfirmed = window.confirm("Do you want to enable queue announcements?");
      if (userConfirmed) {
        enableAudio();
      }
    }
  }, [audioEnabled, executePanggilan]);

  if (isLoading) return <div>Loading data...</div>;
  if (error) return <div>Error Fetching Data.</div>;

  return (
    <div className='w-full h-full flex flex-col items-center gap-6 px-16 py-8 pt-24'>
      <TopSection data={panggilanData} />
      <BottomSection data={monitoringData} />
    </div>
  );
}

export default Index;
