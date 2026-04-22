"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Files, 
  UserPlus, 
  ShieldCheck, 
  Settings, 
  X,
  CreditCard,
  Target,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Files Directory', href: '/files', icon: Files },
    { name: 'File Registration', href: '/files/register', icon: UserPlus },
    { name: 'Movement Registry', href: '/movements', icon: CreditCard },
    { name: 'Verification', href: '/verification', icon: ShieldCheck },
    { name: 'Operational Reports', href: '/reports', icon: BarChart3 },
    { name: 'Admin Control', href: '/admin', icon: Settings },
  ];

  return (
    <aside className={`sidebar-container glass-sapphire ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <img src="/logo.png" alt="AMF Logo" className="brand-logo-img" />
        </div>
        <div className="brand-info">
          <h2 className="brand-name">AMF FILE <span>TRACKER</span></h2>
          <span className="brand-status">Secure Environment</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      
      <nav className="sidebar-links">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="link-icon">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className="link-label">{item.name}</span>
              {isActive && <div className="active-glow" />}
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="system-card">
          <div className="sc-header">
            <div className="sc-dot" />
            <span>Node: AMF-COL-01</span>
          </div>
          <p className="sc-ver">v3.1.0 - Sapphire Edition</p>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: var(--sidebar-width);
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.25rem;
          position: sticky;
          top: 0;
          z-index: 200;
          flex-shrink: 0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          .sidebar-container { position: fixed; left: 0; top: 0; transform: translateX(-100%); }
          .sidebar-container.sidebar-open { transform: translateX(0); }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
          padding: 0 0.5rem;
        }

        .brand-logo-wrap {
          width: 42px;
          height: 42px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          flex-shrink: 0;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 2px;
        }

        .brand-name {
          font-size: 1.1rem;
          font-weight: 900;
          color: white;
          letter-spacing: 0.05em;
        }
        .brand-name span { color: var(--accent-color); }
        
        .brand-status {
          font-size: 0.6rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
        }

        .sidebar-links { display: flex; flex-direction: column; gap: 0.5rem; flex-grow: 1; }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .sidebar-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .active-glow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent-color);
          box-shadow: 0 0 15px var(--accent-color);
        }

        .sidebar-close-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-left: auto;
        }

        @media (max-width: 768px) { .sidebar-close-btn { display: block; } }

        .sidebar-footer { padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .system-card { padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 12px; }
        .sc-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
        .sc-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
        .sc-ver { font-size: 0.65rem; color: rgba(255, 255, 255, 0.4); margin: 0; }
      `}</style>
    </aside>
  );
}
