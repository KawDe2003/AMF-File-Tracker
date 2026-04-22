"use client";

import { useState } from "react";

interface ExportButtonProps {
  url: string;
  filename: string;
  children: React.ReactNode;
  className?: string;
  successMessage: string;
}

export default function ExportButton({ url, filename, children, className, successMessage }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className={className} 
        onClick={handleExport} 
        disabled={loading}
        style={{ position: 'relative' }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="spinner-mini"></span>
            Generating...
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
        .spinner-mini {
          width: 12px; height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #0f172a;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
          z-index: 2000;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </>
  );
}
