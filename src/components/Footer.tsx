import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">
          &copy; {new Date().getFullYear()} MONARCH - Audio Recognition
        </p>
        <div className="footer-links">
          <a href="https://github.com/yourusername/monarch" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span className="divider">|</span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <span className="divider">|</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
        </div>
      </div>
      <style jsx>{`
        .footer {
          width: 100%;
          padding: 1.5rem 0;
          margin-top: 3rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }
        
        .copyright {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .footer-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .footer-links a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s ease-in-out;
        }
        
        .footer-links a:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .divider {
          color: #d1d5db;
        }
        
        @media (min-width: 640px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
            padding: 0 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 