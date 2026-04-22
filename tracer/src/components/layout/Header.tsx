"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Bell, Menu, Cpu, User, LogOut, ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isCallingAgent: boolean;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setSessionUser(data))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/files?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const roleLabel = (role: string) => {
    if (role === "ADMIN") return "Administrator";
    if (role === "MANAGER") return "Manager";
    return "Staff";
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
            placeholder="Global system search (Enter)..."
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

        <button className="notify-trigger" onClick={() => {}}>
          <Bell size={20} strokeWidth={2} />
          <span className="notify-badge" />
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-wrap">
          <button
            className="profile-group"
            onClick={() => setProfileOpen(!profileOpen)}
            id="profile-menu-toggle"
          >
            <div className="profile-text">
              <p className="pt-name">{sessionUser?.name ?? "Loading..."}</p>
              <p className="pt-role">{sessionUser ? roleLabel(sessionUser.role) : "—"}</p>
            </div>
            <div className="profile-hex">
              <User size={16} />
            </div>
            <ChevronDown size={14} className={`pd-caret ${profileOpen ? "open" : ""}`} />
          </button>

          {profileOpen && (
            <div className="profile-menu" onClick={() => setProfileOpen(false)}>
              <div className="pm-header">
                <div className="pm-avatar">{sessionUser?.name?.substring(0, 2).toUpperCase() ?? "?"}</div>
                <div>
                  <p className="pm-name">{sessionUser?.name}</p>
                  <p className="pm-email">{sessionUser?.email}</p>
                </div>
              </div>
              <div className="pm-divider" />
              <div className="pm-badges">
                <span className="pm-badge role">{sessionUser?.role}</span>
                {sessionUser?.isCallingAgent && <span className="pm-badge agent">Calling Agent</span>}
              </div>
              <div className="pm-divider" />
              <button className="pm-logout" onClick={handleLogout} disabled={loggingOut} id="logout-btn">
                <LogOut size={15} />
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          )}
        </div>
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
          display: none; background: none; border: none; color: var(--slate-500);
          cursor: pointer; padding: 0.5rem; border-radius: 10px; flex-shrink: 0; transition: all 0.2s;
        }
        .mobile-menu-btn:hover { color: var(--slate-900); background: var(--slate-100); }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .sb-hint, .status-indicator, .profile-text, .pd-caret { display: none; }
          .header-search { max-width: 200px; }
        }
        .header-search { flex: 1; max-width: 420px; }
        .search-box { position: relative; display: flex; align-items: center; }
        .sb-icon { position: absolute; left: 1rem; color: var(--slate-400); }
        .sb-input {
          width: 100%; padding: 0.7rem 1rem 0.7rem 2.75rem;
          background: var(--slate-50); border: 1px solid var(--slate-200);
          border-radius: 12px; color: var(--slate-900); font-size: 0.85rem;
          font-weight: 500; transition: all 0.2s;
        }
        .sb-input:focus { border-color: var(--primary-color); background: #ffffff; box-shadow: 0 0 0 4px var(--primary-glow); outline: none; }
        .sb-hint {
          position: absolute; right: 0.75rem; font-size: 0.6rem; font-weight: 800;
          color: var(--slate-400); padding: 0.2rem 0.4rem;
          border: 1px solid var(--slate-200); background: white; border-radius: 6px;
        }
        .header-utils { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0; }
        .status-indicator {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem;
          font-weight: 800; color: var(--success-color); background: #f0fdf4;
          padding: 0.4rem 0.8rem; border-radius: 50px; border: 1px solid #d1fae5;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .notify-trigger { position: relative; background: none; border: none; color: var(--slate-400); cursor: pointer; transition: all 0.2s; display: flex; }
        .notify-trigger:hover { color: var(--primary-color); }
        .notify-badge { position: absolute; top: -2px; right: -2px; width: 9px; height: 9px; background: var(--danger-color); border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px var(--danger-color); }

        /* Profile Dropdown */
        .profile-dropdown-wrap { position: relative; }
        .profile-group {
          display: flex; align-items: center; gap: 0.75rem;
          background: none; border: none; padding: 0.4rem 0.6rem;
          border-radius: 10px; cursor: pointer; transition: background 0.2s;
        }
        .profile-group:hover { background: var(--slate-100); }
        .profile-text { text-align: right; }
        .pt-name { font-size: 0.85rem; font-weight: 800; color: var(--slate-900); margin: 0; line-height: 1.2; }
        .pt-role { font-size: 0.65rem; font-weight: 600; color: var(--slate-500); margin: 0; }
        .profile-hex { width: 36px; height: 36px; background: var(--slate-900); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .pd-caret { color: var(--slate-400); transition: transform 0.2s; }
        .pd-caret.open { transform: rotate(180deg); }
        
        .profile-menu {
          position: absolute; right: 0; top: calc(100% + 0.75rem);
          background: white; border: 1px solid var(--slate-200); border-radius: 14px;
          padding: 0.75rem; min-width: 240px; z-index: 500;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          animation: menuIn 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes menuIn { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }
        .pm-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.25rem; }
        .pm-avatar { width: 38px; height: 38px; background: var(--primary-color); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.85rem; flex-shrink: 0; }
        .pm-name { font-size: 0.85rem; font-weight: 700; color: var(--slate-900); margin: 0; }
        .pm-email { font-size: 0.7rem; color: var(--slate-500); margin: 0; }
        .pm-divider { height: 1px; background: var(--slate-100); margin: 0.6rem 0; }
        .pm-badges { display: flex; gap: 0.5rem; padding: 0 0.25rem; }
        .pm-badge { padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }
        .pm-badge.role { background: #eff6ff; color: var(--primary-color); border: 1px solid #bfdbfe; }
        .pm-badge.agent { background: #f0fdf4; color: var(--success-color); border: 1px solid #bbf7d0; }
        .pm-logout {
          display: flex; align-items: center; gap: 0.6rem; width: 100%; padding: 0.6rem 0.75rem;
          background: none; border: none; border-radius: 8px; color: var(--danger-color);
          font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: background 0.15s;
        }
        .pm-logout:hover { background: #fff1f2; }
      `}</style>
    </header>
  );
}
