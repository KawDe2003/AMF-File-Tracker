"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect, use } from "react";
import ReportSnapshotFilter from "@/components/reports/ReportSnapshotFilter";
import ExportButton from "@/components/ui/ExportButton";
import { 
  FileText, 
  Clock, 
  Shuffle,
  Map, 
  ShieldCheck, 
  AlertCircle,
  Database,
  TrendingUp,
  Layout
} from "lucide-react";

export default function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = use(searchParams);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const filterDate = params.date ? new Date(params.date) : new Date();

  useEffect(() => {
    // Get user role from headers or a separate info call
    // Since we are in client, we can't easily read request headers, 
    // but the system usually stores user info in local storage or we can fetch a /api/me
    fetch('/api/users/me').then(r => r.json()).then(user => setUserRole(user.role)).catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const query = params.date ? `?date=${params.date}` : "";
        const res = await fetch(`/api/reports/verification${query}`);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [params.date]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="card stat-report-card">
      <div className="src-header">
        <div className={`src-icon-box ${color}`}>
          <Icon size={18} />
        </div>
        <span className="src-title">{title}</span>
      </div>
      <div className="src-body">
        <span className="src-value">{value}</span>
      </div>
    </div>
  );

  const registryFiles = data?.registry || [];

  return (
    <AppLayout>
      <div className="reports-container">
        <div className="reports-header">
          <div className="header-info">
            <h1 className="reports-title">Operational <span>Intelligence</span></h1>
            <p className="reports-desc">Historical inventory analysis and verification audit matrices.</p>
          </div>
          <div className="reports-header-actions">
            <ReportSnapshotFilter />
            <div className="export-group">
              <ExportButton 
                 url={`/api/reports/verification?export=true&date=${params.date || new Date().toISOString().split('T')[0]}`} 
                 filename="Verification_Matrix.xlsx"
                 className="btn btn-primary"
                 successMessage="Export downloaded successfully!"
              >
                 <FileText size={16} />
                 Verification Matrix
              </ExportButton>

              <ExportButton 
                 url="/api/reports/allocation" 
                 filename="Allocation_Report.xlsx"
                 className="btn btn-outline"
                 successMessage="Allocation report generated successfully!"
              >
                 <Shuffle size={16} />
                 Allocation Report
              </ExportButton>

              {userRole === 'ADMIN' && (
                <>
                  <ExportButton 
                     url="/api/reports/performance" 
                     filename="Performance_Audit.xlsx"
                     className="btn btn-outline"
                     successMessage="Performance audit exported successfully!"
                  >
                     <TrendingUp size={16} />
                     Performance Matrix
                  </ExportButton>

                  <ExportButton 
                     url="/api/reports/master" 
                     filename="Master_Inventory.xlsx"
                     className="btn btn-secondary"
                     successMessage="Master inventory downloaded successfully!"
                  >
                     <Database size={16} />
                     Master Export
                  </ExportButton>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="reports-loading">
            <div className="loader-pulse" />
            <p>Compiling Historical Snapshot...</p>
          </div>
        ) : (
          <div className="reports-content animate-slide-fade">
            <div className="summary-grid">
               <StatCard title="Total RegistrySize" value={data?.stats.totalFiles} icon={Database} color="sapphire" />
               <StatCard title="CR Books" value={data?.stats.byType.CR} icon={FileText} color="emerald" />
               <StatCard title="Leasing Files" value={data?.stats.byType.LEASING} icon={ShieldCheck} color="amber" />
               <StatCard title="Legal Docs" value={data?.stats.byType.LEGAL} icon={ShieldCheck} color="rose" />
            </div>

            <div className="analytics-layout">
               <div className="card analytics-card">
                  <div className="ac-header">
                     <h3 className="ac-title"><TrendingUp size={16} /> Status Distribution</h3>
                     <span className="ac-tag">System Wide</span>
                  </div>
                  <div className="status-bars">
                     <div className="sb-item">
                        <div className="sb-info"><span>At Branch</span><span>{data?.stats.byStatus.AT_BRANCH}</span></div>
                        <div className="sb-rail"><div className="sb-fill sapphire" style={{ width: `${(data?.stats.byStatus.AT_BRANCH / data?.stats.totalFiles) * 100}%` }}></div></div>
                     </div>
                     <div className="sb-item">
                        <div className="sb-info"><span>In Transit</span><span>{data?.stats.byStatus.IN_TRANSIT}</span></div>
                        <div className="sb-rail"><div className="sb-fill amber" style={{ width: `${(data?.stats.byStatus.IN_TRANSIT / data?.stats.totalFiles) * 100}%` }}></div></div>
                     </div>
                     <div className="sb-item">
                        <div className="sb-info"><span>Completed</span><span>{data?.stats.byStatus.COMPLETED}</span></div>
                        <div className="sb-rail"><div className="sb-fill emerald" style={{ width: `${(data?.stats.byStatus.COMPLETED / data?.stats.totalFiles) * 100}%` }}></div></div>
                     </div>
                  </div>
               </div>

               <div className="card analytics-card">
                  <div className="ac-header">
                     <h3 className="ac-title"><ShieldCheck size={16} /> Priority Matrix</h3>
                     <span className="ac-tag">High Exposure</span>
                  </div>
                  <div className="priority-pills">
                     <div className="pp-item high">
                        <div className="pp-meta">
                           <span className="pp-label">High Priority</span>
                           <span className="pp-count">{data?.stats.byPriority.HIGH}</span>
                        </div>
                     </div>
                     <div className="pp-item medium">
                        <div className="pp-meta">
                           <span className="pp-label">Medium Priority</span>
                           <span className="pp-count">{data?.stats.byPriority.MEDIUM}</span>
                        </div>
                     </div>
                     <div className="pp-item low">
                        <div className="pp-meta">
                           <span className="pp-label">Low Priority</span>
                           <span className="pp-count">{data?.stats.byPriority.LOW}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="card registry-matrix-card">
               <div className="ac-header">
                  <h3 className="ac-title"><Layout size={16} /> Registry Matrix Snapshot</h3>
                  <span className="ac-tag">As at {filterDate.toLocaleDateString()}</span>
               </div>
               <div className="registry-table-wrap">
                  <table className="registry-table">
                     <thead>
                        <tr>
                           <th>Ref ID</th>
                           <th>Title</th>
                           <th>NIC</th>
                           <th>Vehicle No</th>
                           <th>Custodian</th>
                           <th>Status</th>
                           <th>Registered</th>
                        </tr>
                     </thead>
                     <tbody>
                        {registryFiles.length === 0 ? (
                           <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                                 No facilities found for the selected snapshot date.
                              </td>
                           </tr>
                        ) : registryFiles.map((file: any, idx: number) => (
                           <tr 
                              key={file.id} 
                              className="animate-stagger" 
                              style={{ animationDelay: `${idx * 0.05}s` }}
                           >
                              <td className="cell-code">#{file.id.substring(0,8).toUpperCase()}</td>
                              <td className="cell-bold">{file.title}</td>
                              <td>{file.nic}</td>
                              <td>{file.vehicleNo || 'N/A'}</td>
                              <td>{file.currentDept?.name || 'Vault'}</td>
                              <td>
                                 <span className={`badge ${file.status === 'AT_BRANCH' ? 'badge-success' : file.status === 'IN_TRANSIT' ? 'badge-warning' : 'badge-danger'}`}>
                                    {file.status.toLowerCase()}
                                 </span>
                              </td>
                              <td className="cell-date">{new Date(file.createdAt).toLocaleDateString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        <style>{`
          .reports-container { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.4s ease-out; }
          .reports-header { display: flex; justify-content: space-between; align-items: flex-end; }
          .reports-title { font-size: 1.75rem; font-weight: 900; color: var(--slate-900); margin: 0; }
          .reports-title span { color: var(--primary-color); }
          .reports-desc { color: var(--slate-500); font-size: 0.95rem; margin: 0.25rem 0 0; font-weight: 500; }
          .reports-header-actions { display: flex; align-items: center; gap: 1rem; }
          .export-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
          .export-group .btn { white-space: nowrap; }

          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
          .stat-report-card { padding: 1.25rem; border: 1px solid var(--slate-200); }
          .src-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
          .src-icon-box { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
          .src-icon-box.sapphire { background: #eff6ff; color: #2563eb; }
          .src-icon-box.emerald { background: #ecfdf5; color: #059669; }
          .src-icon-box.amber { background: #fffbeb; color: #d97706; }
          .src-icon-box.rose { background: #fff1f2; color: #e11d48; }
          .src-title { font-size: 0.65rem; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; }
          .src-value { font-size: 1.5rem; font-weight: 900; color: var(--slate-900); }

          .analytics-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .analytics-card { border: 1px solid var(--slate-100); padding: 1.5rem; }
          .ac-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
          .ac-title { display: flex; align-items: center; gap: 0.65rem; font-size: 0.9rem; font-weight: 800; color: var(--slate-900); margin: 0; }
          .ac-tag { font-size: 0.6rem; font-weight: 800; color: var(--slate-400); background: var(--slate-50); padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase; }

          .status-bars { display: flex; flex-direction: column; gap: 1.25rem; }
          .sb-item { display: flex; flex-direction: column; gap: 0.5rem; }
          .sb-info { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--slate-600); }
          .sb-rail { height: 6px; background: var(--slate-100); border-radius: 10px; overflow: hidden; }
          .sb-fill { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
          .sb-fill.sapphire { background: var(--primary-color); }
          .sb-fill.amber { background: var(--warning-color); }
          .sb-fill.emerald { background: var(--success-color); }

          .priority-pills { display: flex; flex-direction: column; gap: 0.75rem; }
          .pp-item { padding: 1rem; border-radius: 12px; border: 1px solid transparent; }
          .pp-item.high { background: #fff1f2; border-color: #fecaca; color: #be123c; }
          .pp-item.medium { background: #fffbeb; border-color: #fde68a; color: #92400e; }
          .pp-item.low { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
          .pp-meta { display: flex; justify-content: space-between; align-items: center; }
          .pp-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
          .pp-count { font-size: 1.25rem; font-weight: 900; }

          .registry-matrix-card { border: 1px solid var(--slate-100); padding: 0; overflow: hidden; }
          .registry-matrix-card .ac-header { padding: 1.5rem 1.5rem 0.5rem; }
          .registry-table-wrap { overflow-x: auto; }
          .registry-table { width: 100%; border-collapse: collapse; min-width: 800px; }
          .registry-table th { 
             text-align: left; padding: 1rem 1.5rem; background: #f8fafc; font-size: 0.7rem; font-weight: 800; color: var(--slate-400); 
             text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--slate-100);
          }
          .registry-table td { padding: 1rem 1.5rem; font-size: 0.85rem; border-bottom: 1px solid var(--slate-50); }
          .cell-code { font-weight: 700; color: var(--primary-color); font-size: 0.85rem; }
          .cell-bold { font-weight: 800; color: var(--slate-900); }
          .cell-date { font-size: 0.75rem; color: var(--slate-500); font-weight: 600; }

          .reports-loading { padding: 5rem; text-align: center; }
        `}</style>
      </div>
    </AppLayout>
  );
}
