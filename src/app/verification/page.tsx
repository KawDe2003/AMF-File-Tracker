"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect, useCallback } from "react";
import KycForm from "@/components/forms/KycForm";
import {
  ShieldCheck, ChevronRight, Loader2, Users, CheckCircle2, Clock,
} from "lucide-react";

interface SessionUser {
  id: string;
  name: string;
  role: string;
  isCallingAgent: boolean;
}

export default function VerificationPage() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFile, setEditingFile] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [activeMode, setActiveMode] = useState<"customer" | "guarantor">("customer");

  // Allocation quota info
  const [config, setConfig] = useState<{ filesPerAgent: number } | null>(null);

  // Load session first
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setSession(data))
      .finally(() => setSessionLoading(false));

    fetch("/api/allocation/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      // If the user is a calling agent, show only their assigned files
      // Admins/Managers see all pending files
      const isAgentView = session.isCallingAgent && session.role === "STAFF";
      const url = isAgentView
        ? `/api/files?agentId=${session.id}`
        : "/api/files";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // Filter to only pending verification files
      setFiles(
        data.filter(
          (f: any) =>
            f.customerStatus !== "VERIFIED" || f.guarantorStatus !== "VERIFIED"
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!sessionLoading && session) {
      fetchFiles();
    }
  }, [sessionLoading, session, fetchFiles]);

  const handleStartVerification = (file: any) => {
    setEditingFile(file);
    setActiveMode("customer");
  };

  const handleCancelEdit = () => setEditingFile(null);

  const handleSaveEdit = async (formData: any) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/files/${editingFile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchFiles();
      setEditingFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save verification data");
    } finally {
      setUpdating(false);
    }
  };

  const isAgentView = session?.isCallingAgent && session?.role === "STAFF";
  const completedCount = isAgentView
    ? (config?.filesPerAgent ?? 0) - files.length
    : 0;
  const totalQuota = config?.filesPerAgent ?? 0;

  if (sessionLoading) {
    return (
      <AppLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", gap: "1rem", color: "var(--text-muted)" }}>
          <Loader2 size={24} className="spin-global" />
          <span style={{ fontWeight: 600 }}>Establishing secure session...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="approvals-container">
        {/* HERO */}
        <div className="approvals-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Live <span>Verification</span> Node
            </h1>
            <p className="hero-desc">
              {isAgentView
                ? `Your daily call queue, ${session?.name?.split(" ")[0]}. Files assigned exclusively to you.`
                : "Admin view — all pending verification files across the system."}
            </p>
          </div>

          <div className="hero-stats">
            <div className="mini-stat">
              <span className="ms-val">{files.length}</span>
              <span className="ms-label">Pending</span>
            </div>
            <div className="stat-divider" />
            <div className="mini-stat">
              <span className="ms-val">{files.filter((f) => f.priority === "HIGH").length}</span>
              <span className="ms-label">High Priority</span>
            </div>
            {isAgentView && totalQuota > 0 && (
              <>
                <div className="stat-divider" />
                <div className="mini-stat">
                  <span className="ms-val" style={{ color: "var(--success-color)" }}>
                    {Math.max(0, completedCount)}/{totalQuota}
                  </span>
                  <span className="ms-label">Quota Done</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Agent quota progress bar */}
        {isAgentView && totalQuota > 0 && (
          <div className="quota-bar-wrap">
            <div className="qb-label">
              <CheckCircle2 size={14} />
              Daily Quota Progress
            </div>
            <div className="qb-track">
              <div
                className="qb-fill"
                style={{ width: `${Math.min(100, (Math.max(0, completedCount) / totalQuota) * 100)}%` }}
              />
            </div>
            <span className="qb-pct">
              {totalQuota > 0 ? Math.round((Math.max(0, completedCount) / totalQuota) * 100) : 0}%
            </span>
          </div>
        )}

        {/* Table */}
        <div className="card node-card">
          <div className="node-table-wrap">
            <table className="node-table">
              <thead>
                <tr>
                  <th>Facility Reference</th>
                  <th>Legal Subject</th>
                  <th>Guarantor Node</th>
                  <th>3rd Party</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="loading-state">
                      <Loader2 size={20} className="spin-global" />
                      <p>Opening Secure Channels...</p>
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-node-state">
                      <ShieldCheck size={48} style={{ opacity: 0.1, marginBottom: "1rem" }} />
                      <p>
                        {isAgentView
                          ? "No files allocated to you yet. Ask your admin to run the allocation engine."
                          : "All facilities in current queue are fully verified."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file.id} className="node-row">
                      <td>
                        <div className="n-id-wrap">
                          <span className="n-id">#{file.id.substring(0, 8).toUpperCase()}</span>
                          <div
                            className={`badge ${
                              file.priority === "HIGH"
                                ? "badge-danger"
                                : file.priority === "MEDIUM"
                                ? "badge-warning"
                                : "badge-success"
                            }`}
                            style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}
                          >
                            {file.priority}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="n-subject">
                          <span className="n-title">{file.title}</span>
                          <span className={`status-badge ${file.customerStatus === "VERIFIED" ? "success" : "pending"}`}>
                            Consumer: {file.customerStatus || "PENDING"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${file.guarantorStatus === "VERIFIED" ? "success" : "pending"}`}>
                          Guarantor: {file.guarantorStatus || "PENDING"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${file.thirdPartyStatus === "VERIFIED" ? "success" : "pending"}`}>
                          Security: {file.thirdPartyStatus || "PENDING"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-icon"
                          onClick={() => handleStartVerification(file)}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Modal */}
        {editingFile && (
          <div className="modal-overlay" onClick={handleCancelEdit}>
            <div className="modal-content-kyc" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-kyc">
                <div className="mht">
                  <h2 className="modal-title-kyc">
                    Live Verification <span>Terminal</span>
                  </h2>
                  <p className="modal-desc-kyc">
                    Identity Logic #{editingFile.id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="modal-actions-wrap" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                  <div className="tab-switcher" style={{ margin: 0 }}>
                    <button
                      className={`tab-btn ${activeMode === "customer" ? "active" : ""}`}
                      onClick={() => setActiveMode("customer")}
                    >
                      Customer Call
                    </button>
                    <button
                      className={`tab-btn ${activeMode === "guarantor" ? "active" : ""}`}
                      onClick={() => setActiveMode("guarantor")}
                    >
                      Guarantor Call
                    </button>
                  </div>
                  <button className="modal-close-kyc" onClick={handleCancelEdit}>×</button>
                </div>
              </div>
              <div className="modal-body-kyc">
                {/* Blueprint Panel */}
                <div className="file-blueprint-panel">
                  <div className="blueprint-header">
                    <span className="bp-badge">OFFICIAL REGISTRATION REFERENCE</span>
                    <span className="bp-timestamp">Locked for Audit</span>
                  </div>
                  <div className="blueprint-grid">
                    {[
                      ["Asset Ref ID", `#${editingFile.id.substring(0, 8).toUpperCase()}`, true],
                      ["File Category", editingFile.fileType, false],
                      ["Finance Co", editingFile.financeCompany, false],
                      ["Tag Number", editingFile.tagNo || "N/A", true],
                      ["BL Number", editingFile.blNo || "N/A", true],
                      ["Vehicle No", editingFile.vehicleNo || "N/A", true],
                      ["Engine No", editingFile.engineNo || "N/A", true],
                      ["Chassis No", editingFile.chassisNo || "N/A", true],
                      ["Client Name", editingFile.title, false],
                      ["National ID", editingFile.nic, true],
                      ["Branch Code", editingFile.branchCode, false],
                      ["Mktg. Officer", editingFile.marketingOfficer || "N/A", false],
                    ].map(([label, val, mono]) => (
                      <div className="bp-item" key={String(label)}>
                        <label>{label}</label>
                        <div className={`bp-val ${mono ? "monospace" : ""}`}>{String(val)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-spacer" style={{ height: "2rem", borderBottom: "1px dashed var(--border-color)", marginBottom: "2rem" }} />

                <div key={activeMode} className="animate-slide-fade">
                  <KycForm
                    initialData={editingFile}
                    onSubmit={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    loading={updating}
                    submitLabel={`Update & Save ${activeMode === "customer" ? "Customer" : "Guarantor"} Verification`}
                    isUpdate={true}
                    mode={activeMode}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .approvals-container {}
          .approvals-hero { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem; padding: 1rem 0; flex-wrap: wrap; gap: 1rem; }
          .hero-title { font-size: 1.75rem; color: var(--text-main); margin: 0 0 0.25rem 0; line-height: 1; }
          .hero-title span { color: var(--primary-color); }
          .hero-desc { color: var(--text-muted); font-size: 0.95rem; margin: 0; max-width: 500px; }
          .hero-stats { display: flex; align-items: center; gap: 1.5rem; background: #ffffff; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
          .mini-stat { display: flex; flex-direction: column; }
          .ms-val { font-size: 1.25rem; font-weight: 800; color: var(--text-main); line-height: 1; }
          .ms-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
          .stat-divider { width: 1px; height: 24px; background: var(--border-color); }

          /* Quota Bar */
          .quota-bar-wrap { display: flex; align-items: center; gap: 1rem; background: white; border: 1px solid var(--border-color); border-radius: 10px; padding: 0.75rem 1.25rem; margin-bottom: 1.5rem; }
          .qb-label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 700; color: var(--success-color); text-transform: uppercase; white-space: nowrap; }
          .qb-track { flex: 1; height: 6px; background: var(--slate-100); border-radius: 3px; overflow: hidden; }
          .qb-fill { height: 100%; background: linear-gradient(90deg, var(--success-color), #34d399); border-radius: 3px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
          .qb-pct { font-size: 0.8rem; font-weight: 800; color: var(--success-color); white-space: nowrap; }

          .node-card { padding: 0; overflow: hidden; background: #ffffff; }
          .node-table-wrap { overflow-x: auto; }
          .node-table { width: 100%; border-collapse: collapse; }
          .node-table th { text-align: left; padding: 0.75rem 1.5rem; color: var(--text-muted); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #f1f5f9; border-bottom: 1px solid var(--border-color); }
          .node-table td { padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
          .node-row { background: #ffffff; transition: background 0.15s; }
          .node-row:hover { background: #f8fafc; }
          .node-table tr:last-child td { border-bottom: none; }

          .n-id-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem; }
          .n-id { font-size: 0.85rem; color: var(--primary-color); font-weight: 700; background: #eff6ff; padding: 0.1rem 0.3rem; border-radius: 4px; display: inline-block; width: max-content; }
          .n-subject { display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem; }
          .n-title { font-size: 0.85rem; color: var(--text-main); font-weight: 800; }

          .status-badge { display: inline-block; width: max-content; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.5rem; border-radius: 4px; letter-spacing: 0.05em; }
          .status-badge.success { background: #d1fae5; color: #059669; border: 1px solid #10b981; }
          .status-badge.pending { background: #fef3c7; color: #d97706; border: 1px solid #f59e0b; }

          .loading-state, .empty-node-state { padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); font-weight: 500; font-size: 0.85rem; }
          .spin-global { animation: spin-g 1s linear infinite; }
          @keyframes spin-g { 100% { transform: rotate(360deg); } }

          /* KYC Modal */
          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
          .modal-content-kyc { background: #ffffff; border-radius: 12px; width: 100%; max-width: 1000px; max-height: 94vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          .modal-header-kyc { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
          .modal-title-kyc { font-size: 1.25rem; margin: 0; color: var(--text-main); font-weight: 800; }
          .modal-title-kyc span { color: var(--primary-color); }
          .modal-desc-kyc { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin: 0.25rem 0 0 0; }
          .modal-close-kyc { background: none; border: none; font-size: 2rem; line-height: 1; color: var(--text-muted); cursor: pointer; transition: color 0.15s; }
          .modal-close-kyc:hover { color: var(--text-main); }
          .modal-body-kyc { padding: 2rem; overflow-y: auto; flex: 1; }
          .modal-actions-wrap { display: flex; align-items: center; gap: 2rem; }

          .file-blueprint-panel { background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 0.5rem; }
          .blueprint-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; }
          .bp-badge { font-size: 0.65rem; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 0.2rem 0.5rem; border-radius: 4px; letter-spacing: 0.05em; }
          .bp-timestamp { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
          .blueprint-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
          .bp-item label { display: block; font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.35rem; letter-spacing: 0.02em; }
          .bp-val { font-size: 0.9rem; font-weight: 800; color: #0f172a; }
          .bp-val.monospace { color: #2563eb; }

          .tab-switcher { display: flex; gap: 0.25rem; background: #e2e8f0; padding: 0.25rem; border-radius: 6px; }
          .tab-btn { padding: 0.4rem 1rem; border: none; background: none; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s; }
          .tab-btn.active { background: #ffffff; color: var(--primary-color); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }

          @media (max-width: 768px) {
            .approvals-hero { flex-direction: column; align-items: flex-start; }
            .hero-stats { width: 100%; }
            .blueprint-grid { grid-template-columns: repeat(2, 1fr); }
            .node-table th:nth-child(3), .node-table td:nth-child(3) { display: none; }
            .node-table td, .node-table th { padding: 0.6rem 0.75rem; }
          }
          @media (max-width: 480px) {
            .node-table th:nth-child(4), .node-table td:nth-child(4) { display: none; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
