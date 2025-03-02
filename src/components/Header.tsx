import React from 'react';
import AnimatedNumber from './AnimatedNumber';

interface HeaderProps {
  totalSongs: number;
}

const Header: React.FC<HeaderProps> = ({ totalSongs }) => {
  return (
    <div className="top-header">
      <h1 className="text-3xl font-bold text-gray-700">MONARCH</h1>
      <h4 className="flex justify-end text-lg">
        <AnimatedNumber includeComma={true} animateToNumber={totalSongs} />
        &nbsp;Songs
      </h4>
      <style jsx>{`
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 600px;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Header; 