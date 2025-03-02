import React from 'react';
import { LiaLaptopSolid } from 'react-icons/lia';
import { FaMicrophoneLines } from 'react-icons/fa6';

interface AudioInputSelectorProps {
  audioInput: string;
  onSelectDevice: () => void;
  onSelectMicrophone: () => void;
}

const AudioInputSelector: React.FC<AudioInputSelectorProps> = ({
  audioInput,
  onSelectDevice,
  onSelectMicrophone
}) => {
  return (
    <div className="audio-input-selector">
      <div
        onClick={onSelectDevice}
        className={`audio-input-device ${audioInput === 'device' ? 'active' : ''}`}
      >
        <LiaLaptopSolid style={{ height: 20, width: 20 }} />
      </div>
      <div
        onClick={onSelectMicrophone}
        className={`audio-input-mic ${audioInput === 'mic' ? 'active' : ''}`}
      >
        <FaMicrophoneLines style={{ height: 20, width: 20 }} />
      </div>
      <style jsx>{`
        .audio-input-selector {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .audio-input-device,
        .audio-input-mic {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e5e7eb;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        
        .audio-input-device.active,
        .audio-input-mic.active {
          background-color: #3b82f6;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AudioInputSelector; 