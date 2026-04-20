"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Bell, 
  Menu, 
  Cpu, 
  CircleAlert,
  User,
  Settings
} from 'lucide-react';
import ToastButton from "@/components/ui/ToastButton";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/files?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const triggerNotify = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <header className="header-container glass-slate">
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <Menu size={20} />
      </button>

      <div className="header-search">
        <div className="search-box">
          <Search className="sb-icon" size={16} />
          <input 
            type="text" 
            placeholder="Global system search (⌘K)..." 
            className="sb-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <span className="sb-hint">Enter</span>
        </div>
      </div>
      
      <div className="header-utils">
        <div className="status-indicator">
          <Cpu size={14} />
          <span className="status-text">Core Active</span>
        </div>

        <button className="notify-trigger" onClick={triggerNotify}>
          <Bell size={20} strokeWidth={2} />
          <span className="notify-badge" />
        </button>

        {showToast && (
          <div className="toast-notification">
            <CircleAlert size={16} style={{ marginRight: '8px' }} />
            System sync established. Total records synchronized.
          </div>
        )}
        
        <ToastButton 
          className="profile-group" 
          successMessage="Session control terminal initialized. Identity verified."
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="profile-text">
            <p className="pt-name">Admin Terminal</p>
            <p className="pt-role">Security Level 1</p>
          </div>
          <div className="profile-hex">
            <User size={16} />
          </div>
        </ToastButton>
      </div>
      
      <style>{`
        .header-container {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 150;
          gap: 1.5rem;
          position: sticky;
          top: 0;
          border-bottom: 1px solid var(--slate-200);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--slate-500);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 10px;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .mobile-menu-btn:hover { color: var(--slate-900); background: var(--slate-100); }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .sb-hint, .status-indicator, .profile-text { display: none; }
          .header-search { max-width: 200px; }
        }

        .header-search { flex: 1; max-width: 420px; }

        .search-box { position: relative; display: flex; align-items: center; }

        .sb-icon { position: absolute; left: 1rem; color: var(--slate-400); }

        .sb-input {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.75rem;
          background: var(--slate-50);
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          color: var(--slate-900);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .sb-input:focus {
          border-color: var(--primary-color);
          background: #ffffff;
          box-shadow: 0 0 0 4px var(--primary-glow);
          outline: none;
        }

        .sb-hint {
          position: absolute;
          right: 0.75rem;
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--slate-400);
          padding: 0.2rem 0.4rem;
          border: 1px solid var(--slate-200);
          background: white;
          border-radius: 6px;
        }

        .header-utils { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0; }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--success-color);
          background: #f0fdf4;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          border: 1px solid #d1fae5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .notify-trigger { position: relative; background: none; border: none; color: var(--slate-400); cursor: pointer; transition: all 0.2s; display: flex; }
        .notify-trigger:hover { color: var(--primary-color); }

        .notify-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 9px;
          height: 9px;
          background: var(--danger-color);
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 8px var(--danger-color);
        }

        .profile-group { display: flex; align-items: center; gap: 1rem; }

        .profile-text { text-align: right; }
        .pt-name { font-size: 0.85rem; font-weight: 800; color: var(--slate-900); margin: 0; line-height: 1.2; }
        .pt-role { font-size: 0.65rem; font-weight: 600; color: var(--slate-500); margin: 0; letter-spacing: 0.02em; }

        .profile-hex {
          width: 36px;
          height: 36px;
          background: var(--slate-900);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--slate-900);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);
          z-index: 2000;
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border: 1px solid rgba(255,255,255,0.1);
        }

        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </header>
  );
}
