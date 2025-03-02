'use client';

import React, { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import media recorder libraries dynamically only on client side
// import { register } from 'extendable-media-recorder';
// import { connect } from 'extendable-media-recorder-wav-encoder';

import Form from '../components/Form';
import Listen from '../components/Listen';
import CarouselSliders from '../components/CarouselSliders';
import Header from '../components/Header';
import AudioInputSelector from '../components/AudioInputSelector';
import Footer from '../components/Footer';
import { Match, RecordData } from '../types';

let socket: Socket;

export default function Home() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [audioInput, setAudioInput] = useState('device'); // 'device' or 'mic'
  const [isPhone, setIsPhone] = useState(false);
  const [registeredMediaEncoder, setRegisteredMediaEncoder] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const sendRecordingRef = useRef(true);

  // Initialize socket connection
  useEffect(() => {
    const initSocket = async () => {
      try {
        // Make sure we're on the client side
        if (typeof window === 'undefined') return;
        
        // Ping the socket endpoint to ensure it's ready
        await fetch('/api/socket');
        
        if (!socket) {
          // Create a new socket connection
          socket = io({
            path: '/api/socket/io',
            addTrailingSlash: false,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            forceNew: true, // Force a new connection
            autoConnect: true // Automatically connect
          });
          
          socket.on('connect', () => {
            console.log('Socket connected with ID:', socket.id);
            socket.emit('totalSongs', '');
            setSocketInitialized(true);
          });
          
          socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            toast.error('Connection error. Trying to reconnect...');
          });
          
          socket.on('error', (error) => {
            console.error('Socket error:', error);
            toast.error(`Socket error: ${error.message || 'Unknown error'}`);
          });
          
          socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
              // The server has forcefully disconnected the socket
              socket.connect();
            }
          });
          
          socket.on('matches', (matchesData: string) => {
            try {
              const parsedMatches = JSON.parse(matchesData) as Match[];
              
              if (parsedMatches && parsedMatches.length > 0) {
                setMatches(parsedMatches.slice(0, 5));
                console.log('Matches:', parsedMatches);
              } else {
                toast('No song found.');
              }
              
              cleanUp();
            } catch (error) {
              console.error('Error parsing matches:', error);
              toast.error('Error processing matches');
              cleanUp();
            }
          });
          
          socket.on('downloadStatus', (msg: string) => {
            try {
              const parsedMsg = JSON.parse(msg) as { type: 'info' | 'success' | 'error'; message: string };
              
              if (parsedMsg.type && ['info', 'success', 'error'].includes(parsedMsg.type)) {
                toast[parsedMsg.type](parsedMsg.message);
              } else {
                toast(parsedMsg.message);
              }
            } catch (error) {
              console.error('Error parsing download status:', error);
              toast.error('Error processing download status');
            }
          });
          
          socket.on('totalSongs', (songsCount: number) => {
            setTotalSongs(songsCount);
          });
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
        toast.error('Error connecting to server');
      }
    };
    
    initSocket();
    
    // Check if device is a phone
    setIsPhone(window.innerWidth <= 550);
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Update stream ref when stream changes
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Periodically update total songs
  useEffect(() => {
    if (!socketInitialized) return;
    
    const emitTotalSongs = () => {
      socket.emit('totalSongs', '');
    };
    
    const intervalId = setInterval(emitTotalSongs, 8000);
    
    return () => clearInterval(intervalId);
  }, [socketInitialized]);

  // Set audio input to mic on mobile devices
  useEffect(() => {
    if (isPhone) {
      setAudioInput('mic');
    }
  }, [isPhone]);

  const record = async () => {
    try {
      const mediaDevice = audioInput === 'device'
        ? navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices)
        : navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      
      // Register WAV encoder if not already registered
      if (!registeredMediaEncoder) {
        // Dynamically import the media recorder libraries
        const { register } = await import('extendable-media-recorder');
        const { connect } = await import('extendable-media-recorder-wav-encoder');
        await register(await connect());
        setRegisteredMediaEncoder(true);
      }
      
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
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/wav',
      });
      
      mediaRecorder.start();
      setIsListening(true);
      sendRecordingRef.current = true;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      // Stop recording after 20 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 20000);
      
      mediaRecorder.addEventListener('stop', async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        
        cleanUp();
        
        reader.readAsArrayBuffer(blob);
        reader.onload = async (event) => {
          if (!event.target || !event.target.result) return;
          
          const arrayBuffer = event.target.result as ArrayBuffer;
          
          // Get record duration
          const arrayBufferCopy = arrayBuffer.slice(0);
          const audioContext = new AudioContext();
          const audioBufferDecoded = await audioContext.decodeAudioData(arrayBufferCopy);
          const recordDuration = audioBufferDecoded.duration;
          
          // Convert to base64
          const binary = Array.from(new Uint8Array(arrayBuffer))
            .map(byte => String.fromCharCode(byte))
            .join('');
          
          const rawAudio = btoa(binary);
          const audioConfig = audioStream.getAudioTracks()[0].getSettings();
          
          const recordData: RecordData = {
            audio: rawAudio,
            duration: recordDuration,
            channels: audioConfig.channelCount || 1,
            sampleRate: audioConfig.sampleRate || 44100,
            sampleSize: audioConfig.sampleSize || 16,
          };
          
          if (sendRecordingRef.current && socket) {
            socket.emit('newRecording', JSON.stringify(recordData));
          }
        };
      });
    } catch (error) {
      console.error('Error recording:', error);
      cleanUp();
      toast.error('Error starting recording');
    }
  };

  const cleanUp = () => {
    const currentStream = streamRef.current;
    
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    
    setStream(null);
    setIsListening(false);
  };

  const stopListening = () => {
    cleanUp();
    sendRecordingRef.current = false;
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
        {socketInitialized && <Form socket={socket} toast={toast} />}
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
