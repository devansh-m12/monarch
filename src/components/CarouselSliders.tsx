import React from 'react';
import { Match } from '../types';

interface CarouselSlidersProps {
  matches: Match[];
}

const CarouselSliders: React.FC<CarouselSlidersProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      <h2 className="matches-title">Matches</h2>
      <div className="matches-list">
        {matches.map((match, index) => (
          <div key={match.songId} className="match-item">
            <div className="match-rank">{index + 1}</div>
            <div className="match-info">
              <h3 className="match-title">{match.songTitle}</h3>
              <p className="match-artist">{match.songArtist}</p>
              <div className="match-score-container">
                <div 
                  className="match-score-bar" 
                  style={{ 
                    width: `${Math.min(100, (match.score / matches[0].score) * 100)}%` 
                  }}
                ></div>
                <span className="match-score-text">{match.score.toFixed(2)}</span>
              </div>
            </div>
            {match.youtubeId && (
              <a 
                href={`https://www.youtube.com/watch?v=${match.youtubeId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="youtube-link"
              >
                YouTube
              </a>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .carousel-container {
          width: 100%;
          max-width: 600px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        
        .matches-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .matches-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .match-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: transform 0.2s ease-in-out;
        }
        
        .match-item:hover {
          transform: translateY(-2px);
        }
        
        .match-rank {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.5rem;
          height: 2.5rem;
          background-color: #3b82f6;
          color: white;
          border-radius: 50%;
          font-weight: 600;
          margin-right: 1rem;
        }
        
        .match-info {
          flex: 1;
        }
        
        .match-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          color: #1f2937;
        }
        
        .match-artist {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0.5rem;
        }
        
        .match-score-container {
          position: relative;
          height: 0.5rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        
        .match-score-bar {
          height: 100%;
          background-color: #3b82f6;
          border-radius: 9999px;
        }
        
        .match-score-text {
          position: absolute;
          top: -1.25rem;
          right: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .youtube-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #ef4444;
          color: white;
          border-radius: 0.375rem;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s ease-in-out;
        }
        
        .youtube-link:hover {
          background-color: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default CarouselSliders; 