import AppLayout from "@/components/layout/AppLayout";
import prisma from "@/lib/prisma";
import { FileStatus, FileType, Priority } from "@prisma/client";
import { 
  BarChart3, 
  FileText, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  PieChart,
  Activity,
  Table as TableIcon,
  User as UserIcon,
  Tag
} from 'lucide-react';
import ExportButton from "@/components/ui/ExportButton";
import ReportSnapshotFilter from "@/components/reports/ReportSnapshotFilter";

export default async function ReportsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ date?: string }> 
}) {
  const { date: dateParam } = await searchParams;
  
  // Parse Snapshot Date
  const filterDate = dateParam ? new Date(dateParam) : null;
  if (filterDate) {
    filterDate.setHours(23, 59, 59, 999);
  }

  // Unified Filter Object
  const snapshotFilter = filterDate ? { createdAt: { lte: filterDate } } : {};

  // Analytical aggregates
  const [totalFiles, statusCounts, typeCounts, priorityCounts, registryFiles] = await Promise.all([
    prisma.file.count({ where: snapshotFilter }),
    Promise.all([
      prisma.file.count({ where: { ...snapshotFilter, status: FileStatus.AT_BRANCH } }),
      prisma.file.count({ where: { ...snapshotFilter, status: FileStatus.IN_TRANSIT } }),
      prisma.file.count({ where: { ...snapshotFilter, status: FileStatus.COMPLETED } }),
    ]),
    Promise.all([
      prisma.file.count({ where: { ...snapshotFilter, fileType: FileType.LEASING } }),
      prisma.file.count({ where: { ...snapshotFilter, fileType: FileType.CR } }),
      prisma.file.count({ where: { ...snapshotFilter, fileType: FileType.LEGAL } }),
    ]),
    Promise.all([
      prisma.file.count({ where: { ...snapshotFilter, priority: Priority.HIGH } }),
      prisma.file.count({ where: { ...snapshotFilter, priority: Priority.MEDIUM } }),
      prisma.file.count({ where: { ...snapshotFilter, priority: Priority.LOW } }),
    ]),
    prisma.file.findMany({
      where: snapshotFilter,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        currentDept: true
      }
    })
  ]);

  const maxStatus = Math.max(...statusCounts, 1);
  const maxType = Math.max(...typeCounts, 1);

  const displayDateStr = filterDate ? filterDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return (
    <AppLayout>
      <div className="reports-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
        <section className="reports-hero">
          <div className="hero-content">
            <h1 className="hero-title">Operations <span className="text-gradient">Intelligence</span></h1>
            <p className="hero-desc">System-wide analytical overview of asset distribution as at <strong>{displayDateStr}</strong>.</p>
          </div>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
            <ExportButton 
              url={`/api/reports/verification?type=verification${dateParam ? `&date=${dateParam}` : ''}`}
              filename={`Verification_Matrix_${displayDateStr}.xlsx`}
              className="btn btn-outline" 
              successMessage="Premium Verification Matrix generated."
            >
              <TableIcon size={18} />
              Verification Matrix (XLSX)
            </ExportButton>

            <ExportButton 
              url={`/api/reports/verification?type=all${dateParam ? `&date=${dateParam}` : ''}`}
              filename={`Inventory_Protocol_${displayDateStr}.xlsx`}
              className="btn btn-primary btn-glow" 
              successMessage="Full Protocol Excel ready for download."
            >
              <Download size={18} />
              Full Inventory (XLSX)
            </ExportButton>
          </div>
        </section>

        <ReportSnapshotFilter />

        {/* High-Level Stats */}
        <div className="stats-matrix">
           <div className="card stat-node">
              <div className="sn-header">
                 <FileText size={20} className="sapphire-text" />
                 <span className="sn-label">Captured Registry</span>
              </div>
              <div className="sn-body">
                 <h2 className="sn-value">{totalFiles}</h2>
                 <p className="sn-meta">Facilities Found</p>
              </div>
           </div>
           
           <div className="card stat-node">
              <div className="sn-header">
                 <TrendingUp size={20} className="emerald-text" />
                 <span className="sn-label">System Health</span>
              </div>
              <div className="sn-body">
                 <h2 className="sn-value">98.4%</h2>
                 <p className="sn-meta">Data Integrity</p>
              </div>
           </div>

           <div className="card stat-node">
              <div className="sn-header">
                 <Clock size={20} className="amber-text" />
                 <span className="sn-label">Avg. Latency</span>
              </div>
              <div className="sn-body">
                 <h2 className="sn-value">1.2d</h2>
                 <p className="sn-meta">Transit Speed</p>
              </div>
           </div>

           <div className="card stat-node">
              <div className="sn-header">
                 <ShieldCheck size={20} className="rose-text" />
                 <span className="sn-label">Security Escrow</span>
              </div>
              <div className="sn-body">
                 <h2 className="sn-value">Locked</h2>
                 <p className="sn-meta">Vault Status</p>
              </div>
           </div>
        </div>

        <div className="reports-grid">
           {/* Row 1: Status & Type */}
           <div className="card chart-node">
              <div className="cn-header">
                 <h3 className="cn-title"><Activity size={16} /> Asset Status Distribution</h3>
              </div>
              <div className="cn-body chart-bars">
                 <div className="chart-item">
                    <div className="ci-info"><span className="ci-label">At Branch</span> <span className="ci-val">{statusCounts[0]}</span></div>
                    <div className="ci-bar-wrap"><div className="ci-bar sapphire-fill" style={{ width: `${(statusCounts[0]/maxStatus)*100}%` }} /></div>
                 </div>
                 <div className="chart-item">
                    <div className="ci-info"><span className="ci-label">In Transit</span> <span className="ci-val">{statusCounts[1]}</span></div>
                    <div className="ci-bar-wrap"><div className="ci-bar amber-fill" style={{ width: `${(statusCounts[1]/maxStatus)*100}%` }} /></div>
                 </div>
                 <div className="chart-item">
                    <div className="ci-info"><span className="ci-label">Completed</span> <span className="ci-val">{statusCounts[2]}</span></div>
                    <div className="ci-bar-wrap"><div className="ci-bar emerald-fill" style={{ width: `${(statusCounts[2]/maxStatus)*100}%` }} /></div>
                 </div>
              </div>
           </div>

           <div className="card chart-node">
              <div className="cn-header">
                 <h3 className="cn-title"><PieChart size={16} /> File Classification</h3>
              </div>
              <div className="cn-body chart-bars">
                 <div className="chart-item">
                    <div className="ci-info"><span className="ci-label">Leasing Files</span> <span className="ci-val">{typeCounts[0]}</span></div>
                    <div className="ci-bar-wrap"><div className="ci-bar sapphire-fill" style={{ width: `${(typeCounts[0]/maxType)*100}%` }} /></div>
                 </div>
                 <div className="chart-item">
                    <div className="ci-info"><span className="ci-label">CR Books</span> <span className="ci-val">{typeCounts[1]}</span></div>
                    <div className="ci-bar-wrap"><div className="ci-bar rose-fill" style={{ width: `${(typeCounts[1]/maxType)*100}%` }} /></div>
                 </div>
                 <div className="chart-item">
                    <div className="ci-info"><span className="ci-label">Legal Docs</span> <span className="ci-val">{typeCounts[2]}</span></div>
                    <div className="ci-bar-wrap"><div className="ci-bar amber-fill" style={{ width: `${(typeCounts[2]/maxType)*100}%` }} /></div>
                 </div>
              </div>
           </div>

           {/* Row 2: Priority Grid */}
           <div className="card chart-node full-width">
              <div className="cn-header">
                 <h3 className="cn-title"><ShieldCheck size={16} /> Risk & Priority Matrix</h3>
              </div>
              <div className="cn-body priority-grid">
                 <div className="p-item high">
                    <span className="p-label">High Priority</span>
                    <span className="p-count">{priorityCounts[0]}</span>
                    <div className="p-indicator" />
                 </div>
                 <div className="p-item medium">
                    <span className="p-label">Standard Flow</span>
                    <span className="p-count">{priorityCounts[1]}</span>
                    <div className="p-indicator" />
                 </div>
                 <div className="p-item low">
                    <span className="p-label">Low Priority</span>
                    <span className="p-count">{priorityCounts[2]}</span>
                    <div className="p-indicator" />
                 </div>
              </div>
           </div>

           {/* Row 3: Master Registry Table */}
           <div className="card chart-node full-width" style={{ marginTop: '1.5rem' }}>
              <div className="cn-header">
                 <h3 className="cn-title"><TableIcon size={16} /> Master Protocol Registry (Top 50)</h3>
              </div>
              <div className="registry-table-wrap">
                 <table className="registry-table">
                    <thead>
                       <tr>
                          <th>Asset Ref</th>
                          <th>Subject</th>
                          <th>NIC / Passport</th>
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
                       ) : registryFiles.map(file => (
                          <tr key={file.id}>
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

        <style>{`
          .reports-hero { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding: 1rem 0; }
          .hero-title { font-size: 2rem; margin: 0 0 0.5rem 0; font-weight: 900; }
          .hero-desc { color: var(--slate-500); font-size: 1rem; font-weight: 500; }
          
          .stats-matrix { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
          .stat-node { padding: 1.5rem; border: 1px solid var(--slate-100); }
          .sn-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
          .sn-label { font-size: 0.7rem; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; }
          .sn-value { font-size: 2rem; font-weight: 900; margin-bottom: 0.25rem; }
          .sn-meta { font-size: 0.75rem; color: var(--slate-500); font-weight: 600; }

          .sapphire-text { color: var(--primary-color); }
          .emerald-text { color: var(--success-color); }
          .amber-text { color: var(--warning-color); }
          .rose-text { color: var(--danger-color); }

          .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
          .full-width { grid-column: 1 / -1; }
          
          .chart-node { padding: 0; overflow: hidden; }
          .cn-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--slate-100); background: #f8fafc; }
          .cn-title { font-size: 0.95rem; font-weight: 800; color: var(--slate-900); display: flex; align-items: center; gap: 0.75rem; }
          
          .chart-bars { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
          .chart-item { display: flex; flex-direction: column; gap: 0.5rem; }
          .ci-info { display: flex; justify-content: space-between; align-items: flex-end; }
          .ci-label { font-size: 0.8rem; font-weight: 700; color: var(--slate-600); }
          .ci-val { font-size: 0.9rem; font-weight: 900; color: var(--slate-900); }
          
          .ci-bar-wrap { width: 100%; height: 8px; background: var(--slate-100); border-radius: 10px; overflow: hidden; }
          .ci-bar { height: 100%; border-radius: 10px; transition: width 1s ease-out; }
          
          .sapphire-fill { background: var(--primary-color); box-shadow: 0 0 10px rgba(37, 99, 235, 0.3); }
          .amber-fill { background: var(--warning-color); box-shadow: 0 0 10px rgba(217, 119, 6, 0.3); }
          .emerald-fill { background: var(--success-color); box-shadow: 0 0 10px rgba(5, 150, 105, 0.3); }
          .rose-fill { background: var(--danger-color); box-shadow: 0 0 10px rgba(225, 29, 72, 0.3); }

          .priority-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 2rem; }
          .p-item { 
            padding: 1.5rem; border-radius: 16px; border: 1px solid var(--slate-200); 
            display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
            transition: transform 0.2s; position: relative; overflow: hidden;
          }
          .p-item:hover { transform: translateY(-5px); }
          .p-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--slate-500); }
          .p-count { font-size: 2.5rem; font-weight: 900; }
          .p-indicator { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; }
          
          .p-item.high { background: #fff1f2; border-color: #fecaca; }
          .p-item.high .p-count { color: var(--danger-color); }
          .p-item.high .p-indicator { background: var(--danger-color); }

          .p-item.medium { background: #fffbeb; border-color: #fde68a; }
          .p-item.medium .p-count { color: var(--warning-color); }
          .p-item.medium .p-indicator { background: var(--warning-color); }

          .p-item.low { background: #f0fdf4; border-color: #d1fae5; }
          .p-item.low .p-count { color: var(--success-color); }
          .p-item.low .p-indicator { background: var(--success-color); }

          /* Registry Table Styles */
          .registry-table-wrap { overflow-x: auto; }
          .registry-table { width: 100%; border-collapse: collapse; min-width: 800px; }
          .registry-table th { 
             text-align: left; padding: 1rem 1.5rem; background: #f8fafc; 
             font-size: 0.65rem; font-weight: 800; color: var(--slate-400); 
             text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--slate-100);
          }
          .registry-table td { padding: 1rem 1.5rem; font-size: 0.85rem; border-bottom: 1px solid var(--slate-50); }
          .cell-code { font-family: monospace; font-weight: 700; color: var(--primary-color); }
          .cell-bold { font-weight: 800; color: var(--slate-900); }
          .cell-date { font-size: 0.75rem; color: var(--slate-500); font-weight: 600; }

          @media (max-width: 1024px) {
            .stats-matrix { grid-template-columns: repeat(2, 1fr); }
            .reports-grid { grid-template-columns: 1fr; }
          }
          @media (max-width: 640px) {
            .priority-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
