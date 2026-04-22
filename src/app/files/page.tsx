"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { 
  Search, 
  Plus, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Info, 
  User, 
  History, 
  Layout, 
  CornerDownRight,
  ChevronRight,
  TrendingUp,
  Map,
  FileText,
  Loader2
} from "lucide-react";

function FileDirectoryContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || "";
  
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'IDENTITY' | 'PROTOCOL'>('OVERVIEW');
  
  const itemsPerPage = 8;

  // Search/List Fetch
  useEffect(() => {
    async function fetchFiles() {
      try {
        const query = new URLSearchParams();
        if (search) query.append('q', search);
        
        const res = await fetch(`/api/files?${query.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    setLoading(true);
    const timer = setTimeout(fetchFiles, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Detailed Fetch for FIT
  useEffect(() => {
    if (!selectedFileId) {
      setFileDetails(null);
      return;
    }

    async function fetchDetails() {
      setDetailsLoading(true);
      setActiveTab('OVERVIEW');
      try {
        const res = await fetch(`/api/files/${selectedFileId}`);
        if (!res.ok) throw new Error('Failed to fetch details');
        const data = await res.json();
        setFileDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setDetailsLoading(false);
      }
    }

    fetchDetails();
  }, [selectedFileId]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  const filteredFiles = files.filter(file => {
    return (typeFilter === "" || file.fileType === typeFilter) &&
           (statusFilter === "" || file.status === statusFilter);
  });

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / itemsPerPage));
  const paginatedFiles = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'AT_BRANCH': return <span className="fit-badge success">At Branch</span>;
      case 'IN_TRANSIT': return <span className="fit-badge warning">In Transit</span>;
      case 'COMPLETED': return <span className="fit-badge primary">Completed</span>;
      default: return <span className="fit-badge slate">{status}</span>;
    }
  };

  const DataRow = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => (
    <div className={`data-row ${fullWidth ? 'full' : ''}`}>
      <label className="dr-label">{label}</label>
      <span className="dr-value">{value || '---'}</span>
    </div>
  );

  return (
    <AppLayout>
      <div className="explorer-container">
        <div className="explorer-header">
          <div className="header-info">
            <h1 className="explorer-title">Protocol <span>Explorer</span></h1>
            <p className="explorer-desc">Real-time surveillance and historical audit trail for asset distribution.</p>
          </div>
          <Link href="/files/register" className="btn btn-primary btn-glow">
            <Plus size={18} />
            Registration Module
          </Link>
        </div>

        <div className="card explorer-card">
          <div className="explorer-filters">
            <div className="search-group">
              <Search className="sg-icon" size={16} />
              <input 
                type="text" 
                placeholder="Query by ID, Title, NIC, Engine, Chassis..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sg-input"
              />
            </div>
            
            <div className="filter-stack">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="fs-select">
                <option value="">All Categories</option>
                <option value="CR">CR Books</option>
                <option value="LEASING">Leasing Files</option>
                <option value="LEGAL">Legal Documents</option>
              </select>
              
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="fs-select">
                <option value="">All Statuses</option>
                <option value="AT_BRANCH">At Branch</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="explorer-table-wrap">
            <table className="explorer-table">
              <thead>
                <tr>
                  <th>Facility Reference</th>
                  <th>Ownership Profile</th>
                  <th>Classification</th>
                  <th>Active Custodian</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="state-cell">
                      <div className="loader-pulse" />
                      <p className="text-loading">Synchronizing Repository Data...</p>
                    </td>
                  </tr>
                ) : paginatedFiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="state-cell">
                      <p className="cell-muted">No records matched the current criteria.</p>
                    </td>
                  </tr>
                ) : paginatedFiles.map((file) => (
                  <tr key={file.id} className="explorer-row">
                    <td className="cell-id">
                      <div className="ref-pill">
                        <span>#{file.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="cell-main">
                      <span className="main-title">{file.title}</span>
                      <span className="main-meta">{file.nic}</span>
                    </td>
                    <td><span className="tag-category">{file.fileType}</span></td>
                    <td>
                      <div className="custodian-info">
                        <span className="c-name">{file.currentDept?.name || 'Central Vault'}</span>
                        <span className="c-code">LOC-{file.currentDept?.id.substring(0, 4).toUpperCase() || 'ROOT'}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(file.status)}</td>
                    <td>
                      <button 
                         className="btn btn-outline btn-icon" 
                         title="Open Information Terminal"
                         onClick={() => setSelectedFileId(file.id)}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="explorer-footer">
            <p className="footer-stats">Displaying records <strong>{(currentPage-1)*itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage*itemsPerPage, filteredFiles.length)}</strong> of <strong>{filteredFiles.length}</strong> total</p>
            <div className="pagination-group">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="pg-btn">Prev</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                 <button key={i} className={`pg-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="pg-btn">Next</button>
            </div>
          </div>
        </div>

        {/* FACILITY INFORMATION MODAL (FIT) */}
        {selectedFileId && (
           <div className="fit-backdrop" onClick={() => setSelectedFileId(null)}>
              <div className="fit-terminal card" onClick={e => e.stopPropagation()}>
                 <div className="fit-header">
                    <div className="fit-title-group">
                       <h2 className="fit-title">Facility Information Terminal</h2>
                       <div className="fit-id-badge">ID: {selectedFileId.toUpperCase()}</div>
                    </div>
                    <button className="fit-close" onClick={() => setSelectedFileId(null)}>×</button>
                 </div>

                 {detailsLoading ? (
                    <div className="fit-loading-state">
                       <div className="loader-pulse sapphire" />
                       <p>Retrieving Secure Protocol Data...</p>
                    </div>
                 ) : fileDetails && (
                    <>
                       <div className="fit-tabs">
                          <button className={`fit-tab ${activeTab === 'OVERVIEW' ? 'active' : ''}`} onClick={() => setActiveTab('OVERVIEW')}>
                             <Layout size={16} /> Strategic Overview
                          </button>
                          <button className={`fit-tab ${activeTab === 'IDENTITY' ? 'active' : ''}`} onClick={() => setActiveTab('IDENTITY')}>
                             <User size={16} /> Identity Profile
                          </button>
                          <button className={`fit-tab ${activeTab === 'PROTOCOL' ? 'active' : ''}`} onClick={() => setActiveTab('PROTOCOL')}>
                             <History size={16} /> Protocol History
                          </button>
                       </div>

                       <div className="fit-body">
                          {/* OVERVIEW TAB */}
                          {activeTab === 'OVERVIEW' && (
                             <div className="tab-pane overview-pane animate-slide-fade">
                                <div className="pane-grid">
                                   <div className="fit-section">
                                      <h3><Info size={14} /> Core Registry</h3>
                                      <div className="field-grid">
                                         <DataRow label="Finance Co" value={fileDetails.financeCompany} />
                                         <DataRow label="File Received" value={fileDetails.fileReceivedDate} />
                                         <DataRow label="Tag Number" value={fileDetails.tagNo} />
                                         <DataRow label="BL Number" value={fileDetails.blNo} />
                                         <DataRow label="Vehicle No" value={fileDetails.vehicleNo} />
                                         <DataRow label="Reg Status" value={fileDetails.regUnreg} />
                                      </div>
                                   </div>

                                   <div className="fit-section">
                                      <h3><ShieldCheck size={14} /> Operational Metadata</h3>
                                      <div className="field-grid">
                                         <DataRow label="File Type" value={fileDetails.fileType} />
                                         <DataRow label="Priority" value={fileDetails.priority} />
                                         <DataRow label="Marketing Officer" value={fileDetails.marketingOfficer} />
                                         <DataRow label="Branch Code" value={fileDetails.branchCode} />
                                      </div>
                                   </div>

                                   <div className="fit-section full">
                                      <h3><TrendingUp size={14} /> Verification Protocol Status</h3>
                                      <div className="verification-matrix">
                                         <div className="vm-node">
                                            <label>Client Validation</label>
                                            <div className={`status-pill ${fileDetails.customerStatus === 'VERIFIED' ? 'success' : 'pending'}`}>
                                               {fileDetails.customerStatus || 'NOT_STARTED'}
                                            </div>
                                         </div>
                                         <div className="vm-node">
                                            <label>Guarantor Validation</label>
                                            <div className={`status-pill ${fileDetails.guarantorStatus === 'VERIFIED' ? 'success' : 'pending'}`}>
                                               {fileDetails.guarantorStatus || 'NOT_STARTED'}
                                            </div>
                                         </div>
                                         <div className="vm-node">
                                            <label>Security Audit</label>
                                            <div className={`status-pill ${fileDetails.thirdPartyStatus === 'VERIFIED' ? 'success' : 'pending'}`}>
                                               {fileDetails.thirdPartyStatus || 'PENDING'}
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {/* IDENTITY TAB */}
                          {activeTab === 'IDENTITY' && (
                             <div className="tab-pane identity-pane animate-slide-fade">
                                <div className="kyc-scroll-area">
                                   <div className="kyc-cluster">
                                      <div className="kyc-header customer">
                                         <User size={18} />
                                         <span>Primary Customer KYC Profile</span>
                                      </div>
                                      <div className="field-grid">
                                         <DataRow label="Full Name" value={fileDetails.title} fullWidth />
                                         <DataRow label="NIC / Passport" value={fileDetails.nic} />
                                         <DataRow label="Contact Number" value={fileDetails.contactNo} />
                                         <DataRow label="WhatsApp" value={fileDetails.whatsappNo} />
                                         <DataRow label="Alt Contact" value={fileDetails.altContactNo} />
                                         <DataRow label="Best Time to Call" value={fileDetails.bestTimeToCall} />
                                         <DataRow label="Residence Type" value={fileDetails.residenceType} />
                                         <DataRow label="Address" value={fileDetails.address} fullWidth />
                                         <DataRow label="Employment" value={fileDetails.employmentType} />
                                         <DataRow label="Employer" value={fileDetails.employerName} />
                                         <DataRow label="Job Title" value={fileDetails.jobTitle} />
                                         <DataRow label="Eco. Sector" value={fileDetails.economicSector} />
                                         <DataRow label="Salary Date" value={fileDetails.salaryDate} />
                                         <DataRow label="Experience" value={fileDetails.workExperience} />
                                         <DataRow label="Monthly Income" value={fileDetails.monthlyIncome} />
                                         <DataRow label="Other Income" value={fileDetails.otherIncome} />
                                      </div>
                                   </div>

                                   <div className="kyc-cluster" style={{ marginTop: '2rem' }}>
                                      <div className="kyc-header guarantor">
                                         <ShieldCheck size={18} />
                                         <span>Verified Guarantor KYC Profile</span>
                                      </div>
                                      <div className="field-grid">
                                         <DataRow label="NIC / Passport" value={fileDetails.guarantorNic} />
                                         <DataRow label="Relationship" value={fileDetails.guarantorRelationship} />
                                         <DataRow label="Contact Number" value={fileDetails.guarantorContactNo} />
                                         <DataRow label="WhatsApp" value={fileDetails.guarantorWhatsappNo} />
                                         <DataRow label="Residence Type" value={fileDetails.guarantorResidenceType} />
                                         <DataRow label="Address" value={fileDetails.guarantorAddress} fullWidth />
                                         <DataRow label="Employment" value={fileDetails.guarantorEmploymentType} />
                                         <DataRow label="Employer" value={fileDetails.guarantorEmployerName} />
                                         <DataRow label="Monthly Income" value={fileDetails.guarantorMonthlyIncome} />
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {/* PROTOCOL HISTORY TAB */}
                          {activeTab === 'PROTOCOL' && (
                             <div className="tab-pane protocol-pane animate-slide-fade">
                                <div className="timeline">
                                   {fileDetails.movements?.length === 0 ? (
                                      <div className="null-timeline">No historical transfers recorded for this facility.</div>
                                   ) : fileDetails.movements.map((move: any, idx: number) => (
                                      <div key={move.id} className="timeline-item">
                                         <div className="tl-line" />
                                         <div className={`tl-indicator ${idx === 0 ? 'animate-transmission' : ''}`} />
                                         <div className="tl-body">
                                            <div className="tl-header">
                                               <div className="tl-main">
                                                  <CornerDownRight size={14} className="tl-arrow" />
                                                  <span>Transferred to <strong>{move.toDept.name}</strong></span>
                                               </div>
                                               <span className="tl-date">{new Date(move.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="tl-meta">
                                               <span className="tl-user">Sent by: {move.sender.name}</span>
                                               <span className={`tl-status ${move.status.toLowerCase()}`}>{move.status}</span>
                                            </div>
                                            {move.comments && (
                                               <div className="tl-comments">
                                                  <Info size={12} />
                                                  <p>{move.comments}</p>
                                               </div>
                                            )}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}
                       </div>
                    </>
                 )}
              </div>
           </div>
        )}

        <style>{`
          .explorer-container { display: flex; flex-direction: column; gap: 1.5rem; animation: fadeIn 0.4s ease-out; }
          .explorer-header { display: flex; justify-content: space-between; align-items: flex-end; }
          .explorer-title { font-size: 1.75rem; margin: 0 0 0.25rem 0; font-weight: 900; color: var(--slate-900); }
          .explorer-title span { color: var(--primary-color); }
          .explorer-desc { color: var(--slate-500); font-size: 0.95rem; margin: 0; font-weight: 500; }

          .explorer-card { padding: 0; overflow: hidden; border: 1px solid var(--slate-200); }
          .explorer-filters { padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1px solid var(--slate-100); display: flex; justify-content: space-between; gap: 1rem; }
          .search-group { position: relative; flex: 1; max-width: 500px; }
          .sg-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--slate-400); }
          .sg-input { width: 100%; padding: 0.65rem 1rem 0.65rem 2.75rem; background: white; border: 1px solid var(--slate-200); border-radius: 10px; font-size: 0.9rem; transition: all 0.2s; font-weight: 500; }
          .sg-input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); outline: none; }

          .filter-stack { display: flex; gap: 0.75rem; }
          .fs-select { padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid var(--slate-200); background: white; font-size: 0.85rem; font-weight: 700; color: var(--slate-700); cursor: pointer; outline: none; transition: border-color 0.2s; }
          .fs-select:hover { border-color: var(--slate-300); }

          .explorer-table-wrap { overflow-x: auto; }
          .explorer-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
          .explorer-table th { text-align: left; padding: 1rem 1.5rem; background: #f1f5f9; font-size: 0.7rem; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--slate-100); }
          .explorer-row { border-bottom: 1px solid var(--slate-50); transition: background 0.1s; }
          .explorer-row:hover { background: #f8fafc; }
          .explorer-row td { padding: 1.25rem 1.5rem; vertical-align: middle; }

          .ref-pill { display: inline-block; padding: 0.25rem 0.65rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; color: var(--primary-color); font-size: 0.85rem; font-weight: 700; }
          .main-title { display: block; font-weight: 800; color: var(--slate-900); font-size: 1rem; margin-bottom: 0.15rem; }
          .main-meta { display: block; font-size: 0.75rem; font-weight: 600; color: var(--slate-400); }
          
          .tag-category { padding: 0.25rem 0.5rem; background: white; border: 1px solid var(--slate-200); border-radius: 6px; font-size: 0.65rem; font-weight: 800; color: var(--slate-500); text-transform: uppercase; }
          .custodian-info { display: flex; flex-direction: column; }
          .c-name { font-weight: 700; color: var(--slate-900); font-size: 0.9rem; }
          .c-code { font-size: 0.65rem; font-weight: 800; color: var(--slate-400); }

          .fit-badge { padding: 0.35rem 0.75rem; border-radius: 50px; font-size: 0.7rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
          .fit-badge.success { background: #d1fae5; color: #065f46; }
          .fit-badge.warning { background: #fef3c7; color: #92400e; }
          .fit-badge.primary { background: #dbeafe; color: #1e40af; }

          .explorer-footer { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-top: 1px solid var(--slate-100); }
          .footer-stats { font-size: 0.85rem; color: var(--slate-500); font-weight: 500; }
          .pagination-group { display: flex; gap: 0.25rem; }
          .pg-btn { padding: 0.45rem 1rem; border-radius: 8px; border: 1px solid var(--slate-200); background: white; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
          .pg-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
          .pg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

          /* FIT MODAL STYLES */
          .fit-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
          .fit-terminal { width: 100%; max-width: 900px; height: 90vh; display: flex; flex-direction: column; overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255,255,255,0.2); }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

          .fit-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--slate-100); display: flex; justify-content: space-between; align-items: center; background: white; }
          .fit-title { font-size: 1.15rem; font-weight: 900; color: var(--slate-900); margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
          .fit-id-badge { font-size: 0.85rem; background: var(--slate-900); color: white; padding: 0.15rem 0.65rem; border-radius: 4px; margin-top: 0.25rem; font-weight: 700; }
          .fit-close { font-size: 2rem; color: var(--slate-400); background: none; border: none; cursor: pointer; padding: 0; line-height: 1; }

          .fit-tabs { display: flex; gap: 0.5rem; padding: 0 2rem; background: white; border-bottom: 1px solid var(--slate-100); }
          .fit-tab { padding: 1rem 1.25rem; background: none; border: none; font-size: 0.85rem; font-weight: 800; color: var(--slate-400); cursor: pointer; display: flex; align-items: center; gap: 0.65rem; border-bottom: 3px solid transparent; transition: all 0.2s; }
          .fit-tab:hover { color: var(--slate-600); }
          .fit-tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); background: rgba(37, 99, 235, 0.03); }

          .fit-body { flex: 1; overflow-y: auto; padding: 2rem; background: #f8fafc; }
          .fit-section { background: white; border: 1px solid var(--slate-100); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
          .fit-section h3 { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--slate-400); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
          .field-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          
          .data-row { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.5rem 0.75rem; border-radius: 8px; background: #fdfdfd; border: 1px solid transparent; }
          .data-row:hover { background: #f8fafc; border-color: var(--slate-100); }
          .data-row.full { grid-column: 1 / -1; }
          .dr-label { font-size: 0.65rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.02em; }
          .dr-value { font-size: 0.9rem; font-weight: 700; color: var(--slate-800); }

          .verification-matrix { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
          .vm-node { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; padding: 1rem; background: #f8fafc; border-radius: 12px; }
          .vm-node label { font-size: 0.7rem; font-weight: 700; color: var(--slate-500); }
          .status-pill { padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.7rem; font-weight: 900; }
          .status-pill.success { background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; }
          .status-pill.pending { background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; }

          .kyc-cluster { border-left: 4px solid var(--primary-color); padding-left: 1.25rem; }
          .kyc-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; color: var(--slate-800); font-weight: 800; font-size: 1.1rem; }
          .kyc-header.guarantor { color: var(--warning-color); }

          /* TIMELINE */
          .timeline { display: flex; flex-direction: column; gap: 1.5rem; padding: 1rem; }
          .timeline-item { position: relative; padding-left: 2.5rem; padding-bottom: 0.5rem; }
          .tl-line { position: absolute; left: 0.6rem; top: 1.5rem; bottom: -1rem; width: 2px; background: var(--slate-100); }
          .timeline-item:last-child .tl-line { display: none; }
          .tl-indicator { position: absolute; left: 1.5px; top: 1.25rem; width: 1.2rem; height: 1.2rem; background: white; border: 3px solid var(--primary-color); border-radius: 50%; z-index: 2; }
          
          .tl-body { background: white; border: 1px solid var(--slate-100); border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
          .tl-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .tl-main { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
          .tl-arrow { color: var(--primary-color); }
          .tl-date { font-size: 0.7rem; font-weight: 800; color: var(--slate-400); }
          
          .tl-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; }
          .tl-user { font-size: 0.75rem; font-weight: 700; color: var(--slate-600); }
          .tl-status { font-size: 0.65rem; font-weight: 900; padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase; background: #f1f5f9; }
          .tl-status.completed { background: #d1fae5; color: #065f46; }

          .tl-comments { background: #f8fafc; border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: flex-start; gap: 0.75rem; margin-top: 0.5rem; }
          .tl-comments svg { margin-top: 0.2rem; color: var(--primary-color); }
          .tl-comments p { font-size: 0.8rem; margin: 0; font-weight: 500; color: var(--slate-600); line-height: 1.5; }

          .fit-loading-state { padding: 4rem; text-align: center; }
        `}</style>
      </div>
    </AppLayout>
  );
}

export default function FileDirectory() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="loader-pulse sapphire" />
        </div>
      </AppLayout>
    }>
      <FileDirectoryContent />
    </Suspense>
  );
}
