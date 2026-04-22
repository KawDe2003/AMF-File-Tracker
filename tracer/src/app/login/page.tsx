"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* Animated background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="login-card">
        {/* Branding */}
        <div className="login-brand">
          <div className="brand-icon-wrap">
            <Target size={28} strokeWidth={3} />
          </div>
          <div>
            <h1 className="brand-title">AMF FILE <span>TRACKER</span></h1>
            <p className="brand-sub">Associated Motor Finance PLC</p>
          </div>
        </div>

        {/* Header */}
        <div className="login-header">
          <ShieldCheck size={20} className="lh-icon" />
          <div>
            <h2 className="lh-title">Secure Access Terminal</h2>
            <p className="lh-desc">Enter your credentials to authenticate</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <span className="ea-dot" />
              {error}
            </div>
          )}

          <div className="field-group">
            <label className="field-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="operator@amf.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <div className="pass-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="field-input pass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading} id="login-submit-btn">
            {loading ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                Authenticating...
              </>
            ) : (
              "Access System"
            )}
          </button>
        </form>

        <p className="login-footer">
          Contact your system administrator if you have trouble logging in.
        </p>
      </div>

      <style>{`
        .login-shell {
          min-height: 100vh;
          background: var(--slate-900);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
        }
        .blob-1 {
          width: 400px; height: 400px;
          background: var(--sapphire-700);
          top: -100px; left: -100px;
          animation: float1 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 300px; height: 300px;
          background: var(--sapphire-500);
          bottom: -80px; right: -80px;
          animation: float2 10s ease-in-out infinite;
        }
        .blob-3 {
          width: 200px; height: 200px;
          background: #4f46e5;
          top: 50%; left: 60%;
          animation: float1 12s ease-in-out infinite reverse;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(0.95); }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 10;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .brand-icon-wrap {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--sapphire-600), var(--sapphire-800));
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 8px 16px rgba(37,99,235,0.4);
          flex-shrink: 0;
        }

        .brand-title {
          font-size: 1.1rem;
          font-weight: 900;
          color: white;
          letter-spacing: 0.08em;
          margin-bottom: 0.1rem;
        }
        .brand-title span { color: var(--sapphire-400); }
        .brand-sub { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 500; }

        .login-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .lh-icon { color: var(--sapphire-400); margin-top: 2px; flex-shrink: 0; }
        .lh-title { font-size: 1.1rem; font-weight: 800; color: white; margin: 0 0 0.2rem 0; }
        .lh-desc { font-size: 0.8rem; color: rgba(255,255,255,0.45); margin: 0; font-weight: 500; }

        .login-form { display: flex; flex-direction: column; gap: 0; }

        .login-form .field-label { color: rgba(255,255,255,0.6); }
        .login-form .field-input {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          color: white;
        }
        .login-form .field-input:focus {
          background: rgba(255,255,255,0.1);
          border-color: var(--sapphire-400);
          box-shadow: 0 0 0 4px rgba(96,165,250,0.15);
        }
        .login-form .field-input::placeholder { color: rgba(255,255,255,0.25); }

        .pass-wrap { position: relative; }
        .pass-input { padding-right: 3rem !important; }
        .pass-toggle {
          position: absolute; right: 0.875rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer;
          transition: color 0.2s; display: flex; align-items: center;
        }
        .pass-toggle:hover { color: rgba(255,255,255,0.8); }

        .error-alert {
          display: flex; align-items: center; gap: 0.75rem;
          background: rgba(225,29,72,0.12);
          border: 1px solid rgba(225,29,72,0.3);
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .ea-dot { width: 8px; height: 8px; background: #f87171; border-radius: 50%; flex-shrink: 0; }

        .login-btn {
          width: 100%; margin-top: 1.5rem;
          padding: 0.875rem;
          font-size: 0.95rem;
          background: linear-gradient(135deg, var(--sapphire-600), var(--sapphire-700));
          box-shadow: 0 4px 16px rgba(37,99,235,0.4);
          letter-spacing: 0.02em;
        }
        .login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--sapphire-500), var(--sapphire-600));
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.5);
        }
        .login-btn:disabled { opacity: 0.7; }

        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .login-footer {
          text-align: center;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          margin-top: 1.5rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
