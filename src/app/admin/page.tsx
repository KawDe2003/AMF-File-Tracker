"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect, useCallback } from "react";
import {
  Settings, Users, Plus, Shuffle, RefreshCw, Save, Clock,
  ShieldCheck, ToggleLeft, ToggleRight, Loader2, CheckCircle, AlertCircle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isCallingAgent: boolean;
  department?: { name: string } | null;
}

interface AllocConfig {
  filesPerAgent: number;
  autoAllocate: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

type ToastType = "success" | "error" | "info";

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const show = (msg: string, type: ToastType = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}

export const dynamic = "force-dynamic";

export default function AdminPanel() {
  const { toast, show } = useToast();

  // --- Users State ---
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "", email: "", password: "", role: "STAFF",
    departmentId: "", nic: "", isCallingAgent: false,
  });

  // --- Allocation State ---
  const [config, setConfig] = useState<AllocConfig>({ filesPerAgent: 10, autoAllocate: false });
  const [configLoading, setConfigLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [allocRunning, setAllocRunning] = useState(false);
  const [allocResult, setAllocResult] = useState<string | null>(null);

  // --- Audit Logs State ---
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"personnel" | "allocation" | "audit">("personnel");

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setUsersLoading(false);
  }, []);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/audit-logs?limit=100");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetch("/api/departments").then(r => r.json()).then(setDepartments).catch(() => {});
    fetch("/api/allocation/config").then(r => r.json()).then(setConfig).finally(() => setConfigLoading(false));
    if (activeTab === "audit") fetchLogs();
  }, [fetchUsers, activeTab, fetchLogs]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) { show(data.error || "Failed to create user", "error"); return; }
      show(`User "${data.name}" created successfully!`, "success");
      setShowCreateForm(false);
      setNewUser({ name: "", email: "", password: "", role: "STAFF", departmentId: "", nic: "", isCallingAgent: false });
      fetchUsers();
    } catch { show("Network error", "error"); }
    finally { setCreating(false); }
  };

  const toggleCallingAgent = async (user: User) => {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isCallingAgent: !user.isCallingAgent }),
    });
    if (res.ok) {
      show(`${user.name} ${!user.isCallingAgent ? "added to" : "removed from"} agent pool`, "info");
      fetchUsers();
    }
  };

  const saveConfig = async () => {
    setSavingConfig(true);
    const res = await fetch("/api/allocation/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSavingConfig(false);
    if (res.ok) show("Allocation configuration saved!", "success");
    else show("Failed to save config", "error");
  };

  const runAllocation = async () => {
    setAllocRunning(true);
    setAllocResult(null);
    const res = await fetch("/api/allocation/run", { method: "POST" });
    const data = await res.json();
    setAllocRunning(false);
    if (res.ok) { show(data.message, "success"); setAllocResult(data.message); }
    else { show(data.error || data.message || "Allocation failed", "error"); }
  };

  const resetAllocation = async () => {
    if (!confirm("This will unassign ALL files from calling agents. Continue?")) return;
    const res = await fetch("/api/allocation/run", { method: "DELETE" });
    const data = await res.json();
    if (res.ok) show(data.message, "info");
    else show("Reset failed", "error");
  };

  const agentCount = users.filter(u => u.isCallingAgent).length;

  return (
    <AppLayout>
      <div className="admin-wrap">
        {/* Toast */}
        {toast && (
          <div className={`sys-toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        {/* Hero */}
        <div className="admin-hero">
          <div>
            <h1 className="hero-title">Command <span>Headquarters</span></h1>
            <p className="hero-desc">Manage personnel, user roles, and the daily file allocation protocol.</p>
          </div>
          <div className="hero-badges">
            <span className="hb-item"><Users size={14} /> {users.length} Personnel</span>
            <span className="hb-item agent"><ShieldCheck size={14} /> {agentCount} Active Agents</span>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'personnel' ? 'active' : ''}`} onClick={() => setActiveTab('personnel')}>
            <Users size={16} /> Personnel
          </button>
          <button className={`tab-btn ${activeTab === 'allocation' ? 'active' : ''}`} onClick={() => setActiveTab('allocation')}>
            <Shuffle size={16} /> Allocation
          </button>
          <button className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            <Clock size={16} /> Audit Trail
          </button>
        </div>

        <div className="admin-content-area">
          {activeTab === "personnel" && (
            <div className="card admin-card animate-fade-in">
              {/* Personnel Roster UI (from original) */}
              <div className="ac-header">
                <div>
                  <h3 className="ac-title"><Users size={18} /> Personnel Roster</h3>
                  <p className="ac-sub">Manage system operators and their roles</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)} id="create-user-btn">
                  <Plus size={16} /> Register Personnel
                </button>
              </div>
              {showCreateForm && (
                <form onSubmit={handleCreateUser} className="create-user-form">
                  <div className="cuf-title">New Personnel Registration</div>
                  <div className="cuf-grid">
                    <div className="field-group">
                      <label className="field-label">Full Name *</label>
                      <input className="field-input" placeholder="Kasun Perera" required
                        value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Email Address *</label>
                      <input className="field-input" type="email" placeholder="kasun@amf.lk" required
                        value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Initial Password *</label>
                      <input className="field-input" type="password" placeholder="Min 6 characters" required minLength={6}
                        value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Role *</label>
                      <select className="field-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="STAFF">Staff</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div className="cuf-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setShowCreateForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={creating} id="save-user-btn">
                      {creating ? <><Loader2 size={15} className="spin" /> Creating...</> : <><Plus size={15} /> Create User</>}
                    </button>
                  </div>
                </form>
              )}
              <div className="personnel-list">
                {usersLoading ? (
                  <div className="list-loading"><Loader2 size={20} className="spin" /> Loading personnel...</div>
                ) : users.length === 0 ? (
                  <div className="list-empty">No personnel registered yet.</div>
                ) : users.map(u => (
                  <div key={u.id} className="personnel-row">
                    <div className="pr-avatar">{u.name.substring(0, 2).toUpperCase()}</div>
                    <div className="pr-info">
                      <span className="pr-name">{u.name}</span>
                      <span className="pr-email">{u.email}</span>
                    </div>
                    <button
                      className={`agent-pill ${u.isCallingAgent ? "active" : ""}`}
                      onClick={() => toggleCallingAgent(u)}
                    >
                      {u.isCallingAgent ? <><ToggleRight size={16} /> Agent</> : <><ToggleLeft size={16} /> Agent</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "allocation" && (
            <div className="card admin-card animate-fade-in">
              {/* Allocation Protocol UI (from original) */}
              {configLoading ? (
                <div className="list-loading"><Loader2 size={20} className="spin" /> Loading config...</div>
              ) : (
                <div className="alloc-body">
                  <div className="alloc-info-bar">
                    <div className="aib-item">
                      <span className="aib-val">{agentCount}</span>
                      <span className="aib-label">Active Agents</span>
                    </div>
                    <div className="aib-divider" />
                    <div className="aib-item">
                      <span className="aib-val">{config.filesPerAgent}</span>
                      <span className="aib-label">Files / Agent</span>
                    </div>
                  </div>

                  <div className="alloc-config-section">
                    <div className="field-group">
                      <label className="field-label">Files Per Agent (Daily Limit)</label>
                      <input
                        type="number" className="field-input" min={1} max={100}
                        value={config.filesPerAgent}
                        onChange={e => setConfig({ ...config, filesPerAgent: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <button className="btn btn-outline save-config-btn" onClick={saveConfig} disabled={savingConfig}>
                      {savingConfig ? <><Loader2 size={15} className="spin" /> Saving...</> : <><Save size={15} /> Save Configuration</>}
                    </button>
                  </div>

                  <div className="alloc-actions-section">
                    <h4 className="aas-title">Manual Allocation Control</h4>
                    <div className="alloc-btns">
                      <button className="btn btn-primary" onClick={runAllocation} disabled={allocRunning}>
                        {allocRunning ? <><Loader2 size={15} className="spin" /> Running...</> : <><Shuffle size={15} /> Run Allocation</>}
                      </button>
                      <button className="btn btn-danger-outline" onClick={resetAllocation}>
                        <RefreshCw size={15} /> Reset All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "audit" && (
            <div className="card admin-card animate-fade-in">
              <div className="ac-header">
                <div>
                  <h3 className="ac-title"><Clock size={18} /> System Audit Trail</h3>
                  <p className="ac-sub">Chronological history of all system activities</p>
                </div>
                <button className="btn btn-outline" onClick={fetchLogs}>
                  <RefreshCw size={14} className={logsLoading ? "spin" : ""} /> Refresh
                </button>
              </div>
              <div className="audit-list">
                {logsLoading ? (
                  <div className="list-loading"><Loader2 size={20} className="spin" /> Loading audit logs...</div>
                ) : logs.length === 0 ? (
                  <div className="list-empty">No audit records found.</div>
                ) : (
                  <div className="audit-table-wrap">
                    <table className="audit-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Operator</th>
                          <th>Action</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(log => (
                          <tr key={log.id} className="animate-fade-in shadow-sm-hover">
                            <td className="audit-time">
                              {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(log.timestamp))}
                            </td>
                            <td>
                              <div className="audit-user">
                                <span className="au-name">{log.user?.name || 'System / Unidentified'}</span>
                                <span className="au-email">{log.user?.email || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`audit-badge badge-${log.action.toLowerCase()}`}>
                                {log.action.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="audit-detail" title={log.details || ''}>
                              {log.details}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
        .tab-btn { background: none; border: none; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.9rem; color: var(--text-muted); cursor: pointer; transition: all 0.2s; border-radius: 8px; }
        .tab-btn:hover { background: var(--slate-50); color: var(--primary-color); }
        .tab-btn.active { background: #eff6ff; color: var(--primary-color); }
        
        .audit-table-wrap { overflow-x: auto; }
        .audit-table { width: 100%; border-collapse: collapse; min-width: 700px; }
        .audit-table th { text-align: left; padding: 1rem 1.5rem; background: var(--slate-50); font-size: 0.7rem; font-weight: 800; color: var(--slate-400); text-transform: uppercase; }
        .audit-table td { padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--slate-50); font-size: 0.82rem; }
        .audit-time { font-family: monospace; color: var(--slate-500); }
        .audit-user { display: flex; flex-direction: column; }
        .au-name { font-weight: 700; color: var(--slate-900); }
        .au-email { font-size: 0.65rem; color: var(--text-muted); }
        .audit-badge { padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 800; background: var(--slate-100); }
        .badge-login_success { background: #ecfdf5; color: #059669; }
        .badge-verification_update { background: #eff6ff; color: #2563eb; }
        .badge-allocation_run { background: #fdf2f8; color: #db2777; }
        .badge-audit_log_fetch { background: #f1f5f9; color: #64748b; }
        .audit-detail { max-width: 300px; color: var(--slate-600); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }

        .admin-wrap { max-width: 1200px; margin: 0 auto; }
        .admin-hero { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding: 1rem 0; flex-wrap: wrap; gap: 1rem; }
        .hero-title { font-size: 1.75rem; color: var(--text-main); margin: 0 0 0.25rem 0; }
        .hero-title span { color: var(--primary-color); }
        .hero-desc { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
        .hero-badges { display: flex; gap: 0.75rem; }
        .hb-item { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: var(--slate-100); color: var(--slate-600); border: 1px solid var(--slate-200); }
        .hb-item.agent { background: #f0fdf4; color: var(--success-color); border-color: #bbf7d0; }
        
        .admin-card { padding: 0; overflow: hidden; }
        .ac-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--slate-50); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
        .ac-title { font-size: 1rem; margin: 0 0 0.2rem; display: flex; align-items: center; gap: 0.5rem; }
        .ac-sub { font-size: 0.78rem; color: var(--text-muted); margin: 0; }

        .create-user-form { padding: 1.5rem; background: #fafbff; border-bottom: 1px solid var(--border-color); }
        .cuf-title { font-size: 0.8rem; font-weight: 800; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
        .cuf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
        .cuf-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }

        .agent-toggle-btn { display: flex; align-items: center; gap: 0.75rem; background: none; border: 1px solid var(--border-color); border-radius: 10px; padding: 0.6rem 1rem; cursor: pointer; font-size: 0.85rem; color: var(--text-main); transition: all 0.2s; width: 100%; }
        .agent-toggle-btn:hover { background: var(--slate-50); border-color: var(--primary-color); }
        .tog-on { color: var(--success-color); }
        .tog-off { color: var(--slate-400); }
        .spin { animation: adm-spin 1s linear infinite; }
        @keyframes adm-spin { 100% { transform: rotate(360deg); } }

        .personnel-list { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; max-height: 500px; overflow-y: auto; }
        .list-loading, .list-empty { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; }
        .personnel-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.75rem; border-radius: 10px; background: var(--slate-50); border: 1px solid var(--border-color); transition: all 0.15s; }
        .personnel-row:hover { background: var(--slate-100); }
        .pr-avatar { width: 34px; height: 34px; border-radius: 8px; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.75rem; flex-shrink: 0; }
        .pr-info { flex: 1; display: flex; flex-direction: column; gap: 0.05rem; min-width: 0; }
        .pr-name { font-size: 0.82rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-email { font-size: 0.68rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .agent-pill { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.68rem; font-weight: 700; cursor: pointer; border: 1px solid var(--border-color); background: var(--slate-100); color: var(--slate-500); transition: all 0.2s; flex-shrink: 0; }
        .agent-pill.active { background: #f0fdf4; color: var(--success-color); border-color: #bbf7d0; }
        .agent-pill:hover { transform: scale(1.05); }

        .alloc-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .alloc-info-bar { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; background: var(--slate-50); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; }
        .aib-item { text-align: center; }
        .aib-val { display: block; font-size: 1.6rem; font-weight: 900; color: var(--primary-color); line-height: 1; }
        .aib-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; display: block; }
        .aib-divider { width: 1px; height: 40px; background: var(--border-color); }
        
        .alloc-config-section { display: flex; flex-direction: column; gap: 1rem; }
        .save-config-btn { align-self: flex-start; }
        .alloc-divider { height: 1px; background: var(--border-color); }
        .alloc-actions-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .aas-title { font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin: 0; }
        .aas-desc { font-size: 0.8rem; color: var(--text-muted); margin: 0; line-height: 1.6; }
        .alloc-result { background: #f0fdf4; border: 1px solid #bbf7d0; color: #047857; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 600; }
        .alloc-btns { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .btn-danger-outline { background: white; border-color: #fca5a5; color: var(--danger-color); }
        .btn-danger-outline:hover { background: #fff1f2; }
        
        .sys-toast { position: fixed; bottom: 2rem; right: 2rem; display: flex; align-items: center; gap: 0.75rem; padding: 0.9rem 1.25rem; border-radius: 12px; font-weight: 700; font-size: 0.85rem; z-index: 3000; animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 30px rgba(0,0,0,0.15); max-width: 380px; }
        .toast-success { background: #fff; border: 1px solid #bbf7d0; color: #047857; }
        .toast-error { background: #fff; border: 1px solid #fca5a5; color: var(--danger-color); }
        .toast-info { background: #fff; border: 1px solid #bfdbfe; color: var(--primary-color); }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) { .admin-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .admin-hero { flex-direction: column; } .cuf-grid { grid-template-columns: 1fr; } }
      `}</style>


    </AppLayout>
  );
}
