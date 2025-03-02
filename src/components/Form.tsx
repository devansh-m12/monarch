import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { ToastContent, ToastOptions, Id } from 'react-toastify';

interface FormProps {
  socket: Socket;
  toast: (content: ToastContent, options?: ToastOptions) => Id;
}

const Form: React.FC<FormProps> = ({ socket, toast }) => {
  const [spotifyURL, setSpotifyURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!spotifyURL) {
      toast('Please enter a Spotify URL');
      return;
    }
    
    if (!spotifyURL.includes('spotify.com')) {
      toast('Please enter a valid Spotify URL');
      return;
    }
    
    setIsLoading(true);
    socket.emit('newDownload', spotifyURL);
    
    // Reset the form after 1 second
    setTimeout(() => {
      setSpotifyURL('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Spotify URL (track, album, or playlist)"
            value={spotifyURL}
            onChange={(e) => setSpotifyURL(e.target.value)}
            disabled={isLoading}
            className="spotify-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Loading...' : 'Download'}
          </button>
        </div>
      </form>
      <style jsx>{`
        .form-container {
          margin-top: 2rem;
          width: 100%;
          max-width: 600px;
          padding: 0 1rem;
        }
        
        .form-group {
          display: flex;
          gap: 0.5rem;
          width: 100%;
        }
        
        .spotify-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease-in-out;
        }
        
        .spotify-input:focus {
          border-color: #3b82f6;
        }
        
        .submit-button {
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
        }
        
        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Form; 