"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Database, ArrowRight } from "lucide-react";

export default function MovementRegistryPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchMovements() {
      setLoading(true);
      try {
        const query = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
        const res = await fetch(`/api/movements${query}`);
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setMovements(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovements();
  }, [statusFilter]);

  return (
    <AppLayout>
      <div className="reports-container">
        <div className="reports-header">
          <div className="header-info">
            <h1 className="reports-title">Movement <span>Registry</span></h1>
            <p className="reports-desc">Historical log of all asset movements across departments.</p>
          </div>
          <div className="reports-header-actions">
            <select 
               className="btn btn-outline" 
               style={{ background: 'white' }} 
               value={statusFilter} 
               onChange={(e) => setStatusFilter(e.target.value)}
            >
               <option value="ALL">All Statuses</option>
               <option value="PENDING">PENDING</option>
               <option value="APPROVED">APPROVED</option>
               <option value="COMPLETED">COMPLETED</option>
               <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="reports-loading">
            <div className="loader-pulse" />
            <p>Fetching Chain of Custody...</p>
          </div>
        ) : (
          <div className="reports-content animate-slide-fade">
            <div className="card registry-card" style={{ marginTop: '2rem' }}>
               <div className="rc-header">
                  <h3 className="rc-title"><Database size={18} /> Protocol Log</h3>
               </div>
               <div className="table-responsive">
                  <table className="registry-table">
                     <thead>
                        <tr>
                           <th>Track ID</th>
                           <th>Asset Reference</th>
                           <th>Routing</th>
                           <th>Agent</th>
                           <th>Status</th>
                           <th>Timestamp</th>
                        </tr>
                     </thead>
                     <tbody>
                        {movements.length === 0 ? (
                           <tr>
                             <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                               No movements found.
                             </td>
                           </tr>
                        ) : movements.map((m: any) => (
                           <tr key={m.id}>
                              <td>
                                 <span className="cell-code" style={{ fontSize: '0.85rem' }}>#{m.id.substring(0,6).toUpperCase()}</span>
                              </td>
                              <td>
                                 <div className="cell-bold" style={{ fontSize: '0.85rem' }}>{m.file?.title || 'Unknown'}</div>
                                 <div className="cell-date" style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{m.file?.financeCompany} - {m.file?.nic}</div>
                              </td>
                              <td>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--slate-500)' }}>{m.fromDept?.name}</span>
                                    <ArrowRight size={14} style={{ color: 'var(--slate-400)' }} />
                                    <span style={{ color: 'var(--sapphire-600)' }}>{m.toDept?.name}</span>
                                 </div>
                              </td>
                              <td>
                                 <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.sender?.name}</div>
                              </td>
                              <td>
                                 <span className={`status-badge ${m.status.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', fontWeight: 700, borderRadius: '4px' }}>
                                    {m.status}
                                 </span>
                              </td>
                              <td>
                                 <div className="cell-date">
                                    {new Date(m.createdAt).toLocaleDateString()} <span style={{opacity: 0.5}}>{new Date(m.createdAt).toLocaleTimeString()}</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reports-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .reports-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .reports-title { font-size: 1.75rem; font-weight: 900; color: var(--slate-900); margin: 0 0 0.5rem 0; letter-spacing: -0.02em; }
        .reports-title span { color: var(--primary-color); }
        .reports-desc { font-size: 0.95rem; color: var(--slate-500); margin: 0; font-weight: 500; }
        
        .registry-card { border-radius: 16px; overflow: hidden; border: 1px solid var(--slate-100); background: white; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.02); }
        .rc-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--slate-100); background: #fafafa; }
        .rc-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; font-weight: 800; color: var(--slate-800); margin: 0; }
        
        .table-responsive { overflow-x: auto; }
        .registry-table { width: 100%; border-collapse: collapse; }
        .registry-table th { background: white; padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--slate-100); }
        .registry-table td { padding: 1rem 1.5rem; font-size: 0.85rem; border-bottom: 1px solid var(--slate-50); }
        .registry-table tr:hover { background: #f8fafc; }
        
        .status-badge.pending { background: #fef3c7; color: #d97706; }
        .status-badge.approved { background: #d1fae5; color: #059669; }
        .status-badge.completed { background: #e0e7ff; color: #4338ca; }
        .status-badge.rejected { background: #ffe4e6; color: #e11d48; }

        .cell-code { font-weight: 700; color: var(--primary-color); }
        .cell-bold { font-weight: 800; color: var(--slate-900); }
        .cell-date { font-size: 0.75rem; color: var(--slate-500); font-weight: 600; }
        
        .reports-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 0; color: var(--slate-500); font-weight: 600; font-size: 0.9rem; }
        .loader-pulse { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-color); animation: pulse 1.5s infinite ease-in-out; margin-bottom: 1rem; opacity: 0.2; }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
      `}</style>
    </AppLayout>
  );
}
