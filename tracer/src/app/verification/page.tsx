"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import KycForm from "@/components/forms/KycForm";

export default function Verification() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFile, setEditingFile] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [activeMode, setActiveMode] = useState<'customer' | 'guarantor'>('customer');

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const verificationPending = data.filter((f: any) => 
          f.thirdPartyStatus !== 'VERIFIED' || 
          f.customerStatus !== 'VERIFIED'
      );
      setFiles(verificationPending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleEditClick = (file: any) => {
    setEditingFile(file);
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
  };

  const handleSaveEdit = async (formData: any) => {
    if (!editingFile) return;
    setUpdating(true);
    try {
       const res = await fetch(`/api/files/${editingFile.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
       });

       if (!res.ok) throw new Error('Failed to save state');
       const updated = await res.json();
       
       // Update list locally for responsiveness
       setFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
       setEditingFile(null);
    } catch (err) {
       console.error(err);
       alert("Error updating verification state.");
    } finally {
       setUpdating(false);
    }
  };

  return (
    <AppLayout>
      <div className="verification-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="approvals-hero">
          <div className="hero-lead">
            <h1 className="hero-title">Verification <span>Gateway</span></h1>
            <p className="hero-desc">Manage physical asset authorization states and third-party verifications.</p>
          </div>
          <div className="hero-stats">
            <div className="mini-stat">
              <span className="ms-val">{files.length}</span>
              <span className="ms-label">Pending Checks</span>
            </div>
          </div>
        </div>

        <div className="card node-card">
          <div className="node-table-wrap">
            <table className="node-table">
              <thead>
                <tr>
                  <th>Asset Reference</th>
                  <th>Principal (Client)</th>
                  <th>Guarantor Pool</th>
                  <th>Third-Party Auth</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="loading-state">
                        <div className="loading-ring" />
                        <span>Synchronizing verification targets...</span>
                      </div>
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-node-state">
                         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", marginBottom: '0.75rem' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                         <p>No assets pending verification.</p>
                      </div>
                    </td>
                  </tr>
                ) : files.map((file) => {
                  return (
                  <tr key={file.id} className="node-row">
                    <td>
                      <div className="n-id-wrap">
                        <span className="n-id">#{file.id.substring(0, 8).toUpperCase()}</span>
                        <span className="n-title">{file.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${file.customerStatus === 'VERIFIED' ? 'success' : 'pending'}`}>
                           {file.customerStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${file.guarantorStatus === 'VERIFIED' ? 'success' : 'pending'}`}>
                           {file.guarantorStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${file.thirdPartyStatus === 'VERIFIED' ? 'success' : 'pending'}`}>
                           {file.thirdPartyStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-primary" onClick={() => handleEditClick(file)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', background: '#1e40af' }}>
                            Perform Call
                        </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full-Screen Verification Modal */}
        {editingFile && (
           <div className="modal-overlay">
              <div className="modal-content-kyc">
                 <div className="modal-header-kyc">
                    <div className="mht">
                       <h2 className="modal-title-kyc">Live Verification <span>Terminal</span></h2>
                       <p className="modal-desc-kyc">Identity Logic #{editingFile.id.substring(0,8).toUpperCase()}</p>
                    </div>
                    <div className="modal-actions-wrap" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div className="tab-switcher" style={{ margin: 0 }}>
                            <button 
                                className={`tab-btn ${activeMode === 'customer' ? 'active' : ''}`}
                                onClick={() => setActiveMode('customer')}
                            >
                                Customer Call
                            </button>
                            <button 
                                className={`tab-btn ${activeMode === 'guarantor' ? 'active' : ''}`}
                                onClick={() => setActiveMode('guarantor')}
                            >
                                Guarantor Call
                            </button>
                        </div>
                        <button className="modal-close-kyc" onClick={handleCancelEdit}>×</button>
                    </div>
                 </div>
                 <div className="modal-body-kyc">
                    {/* READ-ONLY FILE BLUEPRINT */}
                    <div className="file-blueprint-panel">
                       <div className="blueprint-header">
                          <span className="bp-badge">OFFICIAL REGISTRATION REFERENCE</span>
                          <span className="bp-timestamp">Locked for Audit</span>
                       </div>
                       <div className="blueprint-grid">
                           <div className="bp-item">
                              <label>Asset Ref ID</label>
                              <div className="bp-val monospace">#{editingFile.id.substring(0,8).toUpperCase()}</div>
                           </div>
                           <div className="bp-item">
                              <label>File Category</label>
                              <div className="bp-val">{editingFile.fileType}</div>
                           </div>
                           <div className="bp-item">
                              <label>Finance Co</label>
                              <div className="bp-val">{editingFile.financeCompany}</div>
                           </div>
                           <div className="bp-item">
                              <label>Tag Number</label>
                              <div className="bp-val monospace">{editingFile.tagNo || 'N/A'}</div>
                           </div>
                           <div className="bp-item">
                              <label>BL Number</label>
                              <div className="bp-val monospace">{editingFile.blNo || 'N/A'}</div>
                           </div>
                           <div className="bp-item">
                              <label>Vehicle No</label>
                              <div className="bp-val monospace">{editingFile.vehicleNo || 'N/A'}</div>
                           </div>
                           <div className="bp-item">
                              <label>Engine No</label>
                              <div className="bp-val monospace">{editingFile.engineNo || 'N/A'}</div>
                           </div>
                           <div className="bp-item">
                              <label>Chassis No</label>
                              <div className="bp-val monospace">{editingFile.chassisNo || 'N/A'}</div>
                           </div>
                           <div className="bp-item">
                              <label>Client Name</label>
                              <div className="bp-val">{editingFile.title}</div>
                           </div>
                           <div className="bp-item">
                              <label>National ID</label>
                              <div className="bp-val monospace">{editingFile.nic}</div>
                           </div>
                           <div className="bp-item">
                              <label>Branch Code</label>
                              <div className="bp-val">{editingFile.branchCode}</div>
                           </div>
                           <div className="bp-item">
                              <label>Marketing Officer</label>
                              <div className="bp-val">{editingFile.marketingOfficer || 'N/A'}</div>
                           </div>
                        </div>
                    </div>

                    <div className="form-spacer" style={{ height: '2rem', borderBottom: '1px dashed var(--border-color)', marginBottom: '2rem' }}></div>

                    <KycForm 
                      key={activeMode} // Reset form state when switching mode for clear UI
                      initialData={editingFile}
                      onSubmit={handleSaveEdit}
                      onCancel={handleCancelEdit}
                      loading={updating}
                      submitLabel={`Update & Save ${activeMode === 'customer' ? 'Customer' : 'Guarantor'} Verification`}
                      isUpdate={true}
                      mode={activeMode}
                    />
                 </div>
              </div>
           </div>
        )}

        <style>{`
          .approvals-hero { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding: 1rem 0; }
          .hero-title { font-size: 1.75rem; color: var(--text-main); margin: 0 0 0.25rem 0; line-height: 1; }
          .hero-title span { color: var(--primary-color); }
          .hero-desc { color: var(--text-muted); font-size: 0.95rem; margin: 0; max-width: 500px; }

          .hero-stats { 
             display: flex; align-items: center; gap: 1.5rem; 
             background: #ffffff; padding: 1rem 1.5rem; border-radius: 8px;
             border: 1px solid var(--border-color); box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .mini-stat { display: flex; flex-direction: column; }
          .ms-val { font-size: 1.25rem; font-weight: 800; color: var(--text-main); line-height: 1; }
          .ms-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }

          .node-card { padding: 0; overflow: hidden; background: #ffffff; }
          .node-table-wrap { overflow-x: auto; }
          .node-table { width: 100%; border-collapse: collapse; }
          .node-table th { 
             text-align: left; padding: 0.75rem 1.5rem; color: var(--text-muted); font-size: 0.7rem; 
             font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
             background: #f1f5f9; border-bottom: 1px solid var(--border-color);
          }
          .node-table td { padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
          .node-row { background: #ffffff; transition: background 0.15s; }
          .node-row:hover { background: #f8fafc; }
          .node-table tr:last-child td { border-bottom: none; }

          .n-id-wrap { display: flex; flex-direction: column; gap: 0.15rem; }
          .n-id { font-family: monospace; font-size: 0.75rem; color: var(--primary-color); font-weight: 700; background: #eff6ff; padding: 0.1rem 0.3rem; border-radius: 4px; display: inline-block; width: max-content; }
          .n-title { font-size: 0.85rem; color: var(--text-main); font-weight: 600; }

          .status-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.5rem; border-radius: 4px; }
          .status-badge.success { background: #d1fae5; color: #059669; border: 1px solid #10b981; }
          .status-badge.pending { background: #fef3c7; color: #d97706; border: 1px solid #f59e0b; }

          .edit-select {
             background: #f8fafc; border: 1px solid var(--primary-color); border-radius: 4px; padding: 0.25rem; font-size: 0.75rem; color: var(--text-main); outline: none; width: 100%;
          }

          .loading-state, .empty-node-state { padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); font-weight: 500; font-size: 0.85rem; }
          .loading-ring { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }

          /* KYC Modal Styling */
          .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center; z-index: 1000;
            padding: 2rem;
          }
          .modal-content-kyc {
            background: #ffffff; border-radius: 12px;
            width: 100%; max-width: 1000px; max-height: 94vh;
            display: flex; flex-direction: column; overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .file-blueprint-panel {
            background: #fdfdfd;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 1.25rem;
            margin-bottom: 0.5rem;
          }
          .blueprint-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #f1f5f9;
          }
          .bp-badge {
            font-size: 0.65rem;
            font-weight: 800;
            color: #1e40af;
            background: #eff6ff;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            letter-spacing: 0.05em;
          }
          .bp-timestamp {
            font-size: 0.65rem;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
          }
          .blueprint-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
          .bp-item label {
            display: block;
            font-size: 0.65rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 0.35rem;
            letter-spacing: 0.02em;
          }
          .bp-val {
            font-size: 0.9rem;
            font-weight: 800;
            color: #0f172a;
          }
          .bp-val.monospace {
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.8rem;
            color: #2563eb;
          }

          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .modal-header-kyc {
            padding: 1.5rem 2rem; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            background: #f8fafc;
          }
          .modal-title-kyc { font-size: 1.25rem; margin: 0; color: var(--text-main); font-weight: 800; }
          .modal-title-kyc span { color: var(--primary-color); }
          .modal-desc-kyc { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin: 0.25rem 0 0 0; font-family: monospace; }
          .modal-close-kyc { background: none; border: none; font-size: 2rem; line-height: 1; color: var(--text-muted); cursor: pointer; transition: color 0.15s; }
          .modal-close-kyc:hover { color: var(--text-main); }
          .modal-body-kyc { padding: 2rem; overflow-y: auto; flex: 1; }

          /* Tab Switcher in Modal */
          .tab-switcher { display: flex; gap: 0.25rem; background: #e2e8f0; padding: 0.25rem; border-radius: 6px; }
          .tab-btn { 
            padding: 0.4rem 1rem; border: none; background: none; border-radius: 4px; 
            font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s;
          }
          .tab-btn.active { background: #ffffff; color: var(--primary-color); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
          .tab-btn:hover:not(.active) { color: var(--text-main); }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 768px) {
            .approvals-hero { flex-direction: column; align-items: flex-start; gap: 1rem; }
            .hero-stats { width: 100%; justify-content: flex-start; }
            .hero-title { font-size: 1.4rem; }

            .blueprint-grid { grid-template-columns: repeat(2, 1fr); }

            /* Hide Guarantor column on mobile - show only Asset, Client, 3rd Party, Actions */
            .node-table th:nth-child(3),
            .node-table td:nth-child(3) { display: none; }

            .node-table td, .node-table th { padding: 0.6rem 0.75rem; }
          }

          @media (max-width: 480px) {
            /* On very small screens also hide 3rd party, keep only Asset + Client + Actions */
            .node-table th:nth-child(4),
            .node-table td:nth-child(4) { display: none; }

            .n-title { font-size: 0.75rem; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
