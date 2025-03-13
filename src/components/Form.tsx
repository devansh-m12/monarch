import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface FormProps {
  onSongAdded: (totalSongs: number) => void;
}

export default function Form({ onSongAdded }: FormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a Spotify URL');
      return;
    }

    if (!url.includes('spotify.com')) {
      toast.error('Please enter a valid Spotify URL');
      return;
    }

    setIsLoading(true);
    toast.info('Adding song...');

    try {
      const response = await fetch('/api/songs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add song');
      }

      onSongAdded(data.totalSongs);
      toast.success(`Successfully added "${data.song.title}" by ${data.song.artist}`);
      setUrl('');
    } catch (error) {
      console.error('Error adding song:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add song');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Spotify URL"
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Song'}
        </button>
      </div>
    </form>
  );
} 