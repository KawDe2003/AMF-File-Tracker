"use client";

import { useState } from "react";

export default function ToastButton({ 
  children, 
  successMessage, 
  className, 
  style 
}: { 
  children: React.ReactNode, 
  successMessage: string, 
  className?: string, 
  style?: React.CSSProperties 
}) {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <>
      <button 
        className={className} 
        style={{ ...style, position: 'relative' }} 
        onClick={handleClick} 
        disabled={loading}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span className="toast-spinner"></span>
             Processing...
          </span>
        ) : children}
      </button>

      {showToast && (
        <div className="toast-notification">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 5 12"></polyline></svg>
          {successMessage}
        </div>
      )}

      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #0f172a;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 0.85rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          animation: slideInBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .toast-spinner {
           display: inline-block;
           width: 12px; height: 12px;
           border: 2px solid rgba(255,255,255,0.3);
           border-top-color: white;
           border-radius: 50%;
           animation: spin 1s linear infinite;
        }

        @keyframes slideInBottom {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
