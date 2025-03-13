'use client';

import React, { useState, useRef } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from '../components/Form';
import Listen from '../components/Listen';
import CarouselSliders from '../components/CarouselSliders';
import Header from '../components/Header';
import AudioInputSelector from '../components/AudioInputSelector';
import Footer from '../components/Footer';
import { Match } from '../types';

export default function Home() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [audioInput, setAudioInput] = useState('device'); // 'device' or 'mic'
  const [isPhone, setIsPhone] = useState(false);
  
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Check if device is phone on mount
  React.useEffect(() => {
    setIsPhone(window.innerWidth <= 550);
  }, []);

  // Update stream ref when stream changes
  React.useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Set audio input to mic on mobile devices
  React.useEffect(() => {
    if (isPhone) {
      setAudioInput('mic');
    }
  }, [isPhone]);

  const record = async () => {
    try {
      const mediaDevice = audioInput === 'device'
        ? navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices)
        : navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      
      const constraints = {
        audio: {
          autoGainControl: false,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          sampleSize: 16,
        },
      };
      
      const mediaStream = await mediaDevice(constraints);
      const audioTracks = mediaStream.getAudioTracks();
      const audioStream = new MediaStream(audioTracks);
      
      setStream(audioStream);
      
      // Stop recording when audio track ends
      audioTracks[0].onended = stopListening;
      
      // Stop video tracks if any
      for (const track of mediaStream.getVideoTracks()) {
        track.stop();
      }
      
      // Create media recorder with supported format
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        await sendAudioToServer(blob);
        cleanUp();
      };
      
      mediaRecorder.start();
      setIsListening(true);
      
      // Stop recording after 20 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 20000);
      
    } catch (error) {
      console.error('Error recording:', error);
      cleanUp();
      toast.error('Error starting recording');
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      
      if (data.matches && data.matches.length > 0) {
        setMatches(data.matches.slice(0, 5));
        console.log('Matches:', data.matches);
      } else {
        toast('No song found.');
      }
      
    } catch (error) {
      console.error('Error sending audio:', error);
      toast.error('Error processing audio');
    }
  };

  const cleanUp = () => {
    const currentStream = streamRef.current;
    
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    mediaRecorderRef.current = null;
    setStream(null);
    setIsListening(false);
  };

  const stopListening = () => {
    cleanUp();
  };

  const handleLaptopIconClick = () => {
    setAudioInput('device');
  };

  const handleMicrophoneIconClick = () => {
    setAudioInput('mic');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <Header totalSongs={totalSongs} />
      
      <div className="listen-section">
        <Listen
          stopListening={stopListening}
          disable={false}
          startListening={record}
          isListening={isListening}
        />
      </div>
      
      {!isPhone && (
        <AudioInputSelector 
          audioInput={audioInput}
          onSelectDevice={handleLaptopIconClick}
          onSelectMicrophone={handleMicrophoneIconClick}
        />
      )}
      
      <div className="matches-section">
        <CarouselSliders matches={matches} />
      </div>
      
      <div className="form-section">
        <Form onSongAdded={setTotalSongs} />
      </div>
      
      <Footer />
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      
      <style jsx>{`
        .listen-section,
        .matches-section,
        .form-section {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </main>
  );
}
