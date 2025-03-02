import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

interface ListenProps {
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  disable: boolean;
}

const Listen: React.FC<ListenProps> = ({
  startListening,
  stopListening,
  isListening,
  disable
}) => {
  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="listen-container">
      <button
        className={`listen-button ${isListening ? 'listening' : ''}`}
        onClick={handleClick}
        disabled={disable}
      >
        <FaMicrophone className="microphone-icon" />
        <span className="listen-text">
          {isListening ? 'Listening...' : 'Listen'}
        </span>
      </button>
      <style jsx>{`
        .listen-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 2rem 0;
        }
        
        .listen-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #3b82f6;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .listen-button:hover:not(:disabled) {
          transform: scale(1.05);
          background-color: #2563eb;
        }
        
        .listen-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        
        .listen-button.listening {
          background-color: #ef4444;
          animation: pulse 1.5s infinite;
        }
        
        .microphone-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .listen-text {
          font-size: 1.25rem;
          font-weight: 500;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Listen; 