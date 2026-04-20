import AppLayout from "@/components/layout/AppLayout";
import prisma from "@/lib/prisma";
import { FileStatus } from "@prisma/client";
import Link from 'next/link';
import { 
  BarChart3, 
  Files, 
  Truck, 
  AlertCircle, 
  Activity, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export default async function Home() {
  const totalFiles = await prisma.file.count();
  const filesAtBranch = await prisma.file.count({
    where: { status: FileStatus.AT_BRANCH }
  });
  const filesInTransit = await prisma.file.count({
    where: { status: FileStatus.IN_TRANSIT }
  });
  const delayedFilesCount = 0; 

  const recentMovements = await prisma.fileMovement.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      file: true,
      fromDept: true,
      toDept: true,
      sender: true
    }
  });

  return (
    <AppLayout>
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <section className="dashboard-hero card card-elevated" style={{ padding: '0.75rem 1.25rem' }}>
          <div className="hero-data">
            <h1 className="hero-title" style={{ fontSize: '1.1rem', margin: 0 }}>
              <span className="text-gradient">OPERATIONAL</span> TERMINAL
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '0.7rem', margin: 0, opacity: 0.8 }}>Node AMF-COL-01 | All systems reported nominal.</p>
          </div>
          <div className="hero-controls" style={{ gap: '0.4rem' }}>
            <Link href="/admin" className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}>
              <BarChart3 size={14} />
              Audit
            </Link>
            <Link href="/admin" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}>
              <ShieldCheck size={14} />
              Config
            </Link>
          </div>
        </section>

        {/* Stats Matrix */}
        <div className="stats-grid" style={{ gap: '0.5rem' }}>
          <div className="card compact-stat">
            <div className="stat-header" style={{ marginBottom: '0.25rem' }}>
              <span className="stat-label">Registry</span>
              <div className="stat-icon-wrap sapphire">
                <Files size={14} strokeWidth={2.5} />
              </div>
            </div>
            <div className="stat-main">
              <h2 className="stat-number" style={{ fontSize: '1.5rem' }}>{totalFiles.toLocaleString()}</h2>
              <div className="stat-trend trend-up">
                <ArrowUpRight size={10} strokeWidth={3} />
                <span>+5.2%</span>
              </div>
            </div>
          </div>

          <div className="card compact-stat">
            <div className="stat-header" style={{ marginBottom: '0.25rem' }}>
              <span className="stat-label">Retention</span>
              <div className="stat-icon-wrap emerald">
                <ShieldCheck size={14} strokeWidth={2.5} />
              </div>
            </div>
            <div className="stat-main" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <h2 className="stat-number" style={{ fontSize: '1.5rem' }}>{filesAtBranch.toLocaleString()}</h2>
              <div className="stat-progress-line" style={{ width: '100%' }}>
                <div className="progress-fill emerald-fill" style={{ width: `${totalFiles > 0 ? (filesAtBranch / totalFiles) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="card compact-stat">
            <div className="stat-header" style={{ marginBottom: '0.25rem' }}>
              <span className="stat-label">Transit</span>
              <div className="stat-icon-wrap amber">
                <Truck size={14} strokeWidth={2.5} />
              </div>
            </div>
            <div className="stat-main">
              <h2 className="stat-number" style={{ fontSize: '1.5rem' }}>{filesInTransit.toLocaleString()}</h2>
              <span className="stat-meta">Active: 04</span>
            </div>
          </div>

          <div className="card compact-stat">
            <div className="stat-header" style={{ marginBottom: '0.25rem' }}>
              <span className="stat-label">Alerts</span>
              <div className="stat-icon-wrap rose">
                <AlertCircle size={14} strokeWidth={2.5} />
              </div>
            </div>
            <div className="stat-main">
              <h2 className="stat-number rose-text" style={{ fontSize: '1.5rem' }}>{delayedFilesCount}</h2>
              <span className="stat-meta">Nominal</span>
            </div>
          </div>
        </div>

        <div className="grid-layout">
          {/* Activity Module */}
          <div className="card tracking-module">
            <div className="module-header">
              <h3 className="module-title">
                <Activity size={18} style={{ marginRight: '0.75rem', verticalAlign: 'middle' }} />
                System Activity Log
              </h3>
              <div className="status-badge badge-success">
                Live Feed
              </div>
            </div>

            <div className="activity-feed">
              {recentMovements.length === 0 ? (
                <div className="null-state">System idle. Ready for data ingestion.</div>
              ) : recentMovements.map((m) => (
                <div key={m.id} className="feed-item">
                  <div className="feed-connector" />
                  <div className="feed-indicator sapphire" />
                  <div className="feed-body glass-slate">
                    <div className="feed-header">
                      <span className="file-id">ID: {m.file.id.substring(0,6).toUpperCase()}</span>
                      <span className="file-name">{m.file.title}</span>
                    </div>
                    <p className="feed-msg">
                      Transferred to <strong>{m.toDept.name}</strong> by <span>{m.sender.name}</span>
                    </p>
                    <div className={`badge ${(m.status as string) === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                      {m.status.toLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/files" className="btn btn-outline btn-full">
              <ExternalLink size={14} />
              View Protocol History
            </Link>
          </div>

          {/* Side Column */}
          <div className="side-stack">
            <div className="card actions-module">
              <h3 className="module-title" style={{ marginBottom: '1.5rem' }}>Rapid Access</h3>
              <div className="sh-grid">
                <Link href="/files/register" className="sh-item">
                  <div className="sh-icon sapphire-bg"><Zap size={20} /></div>
                  <span>Registration</span>
                </Link>
                <Link href="/verification" className="sh-item">
                  <div className="sh-icon amber-bg"><ShieldCheck size={20} /></div>
                  <span>Verify</span>
                </Link>
                <Link href="/files" className="sh-item">
                  <div className="sh-icon emerald-bg"><Search size={20} /></div>
                  <span>Explorer</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .dashboard-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .card { padding: 1rem; }

          .dashboard-hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.75rem;
            min-height: auto;
          }
          .hero-data { flex: 1; }
          .hero-title { font-size: 1.35rem; margin-bottom: 0.15rem; letter-spacing: -0.01em; }
          .hero-subtitle { font-size: 0.8rem; color: var(--slate-500); font-weight: 500; max-width: 500px; }
          .hero-controls { display: flex; gap: 0.5rem; }
          .hero-controls .btn { padding: 0.4rem 0.85rem; font-size: 0.75rem; }

          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 0.75rem; 
          }
          
          .compact-stat {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
          }
          .stat-header { display: flex; justify-content: space-between; align-items: center; }
          .stat-label { font-size: 0.65rem; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; }
          
          .stat-icon-wrap {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .stat-icon-wrap svg { width: 14px; height: 14px; }
          
          .stat-main { display: flex; align-items: baseline; gap: 0.75rem; }
          .stat-number { font-size: 1.75rem; font-weight: 900; margin: 0; line-height: 1; }
          
          .stat-trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.65rem; font-weight: 800; background: white; padding: 0.15rem 0.4rem; border-radius: 4px; border: 1px solid var(--slate-100); }
          .stat-progress-line { flex: 1; height: 4px; background: var(--slate-100); border-radius: 10px; overflow: hidden; }
          .stat-meta { font-size: 0.65rem; color: var(--slate-500); font-weight: 600; margin-top: -0.25rem; }

          .grid-layout { display: grid; grid-template-columns: 1.8fr 1fr; gap: 1rem; }
          .tracking-module { padding: 1.25rem; }
          .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--slate-100); }
          .module-title { font-size: 0.9rem; font-weight: 800; margin: 0; }
          
          .status-badge { 
             padding: 0.3rem 0.6rem; 
             border-radius: 50px; font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
          }

          .activity-feed { display: flex; flex-direction: column; gap: 0.75rem; position: relative; margin-bottom: 1.25rem; }
          .feed-item { display: flex; gap: 1rem; position: relative; }
          .feed-indicator { width: 10px; height: 10px; border-radius: 50%; border: 3px solid #ffffff; position: relative; z-index: 2; margin-top: 1.5rem; }
          .feed-connector { position: absolute; left: 4px; top: 2rem; bottom: -0.5rem; width: 1px; background: var(--slate-200); z-index: 1; }
          
          .feed-body { flex: 1; padding: 0.85rem; border-radius: 12px; }
          .feed-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
          .file-id { font-family: var(--font-mono); font-size: 0.65rem; padding: 0.15rem 0.4rem; }
          .file-name { font-size: 0.8rem; font-weight: 800; }
          .feed-msg { font-size: 0.75rem; margin-bottom: 0.5rem; }

          .btn-full { width: 100%; border-radius: 10px; padding: 0.6rem; font-size: 0.8rem; }

          .side-stack { display: flex; flex-direction: column; gap: 1rem; }
          .actions-module { padding: 1.25rem; }
          .sh-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
          .sh-item { padding: 0.85rem 0.25rem; border-radius: 12px; }
          .sh-icon { width: 36px; height: 36px; border-radius: 10px; }
          .sh-icon svg { width: 16px; height: 16px; }
          .sh-item span { font-size: 0.65rem; }
          
          @media (max-width: 1024px) {
            .grid-layout { grid-template-columns: 1fr; }
          }
          
          @media (max-width: 768px) {
            .dashboard-hero { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1rem; }
            .hero-controls { width: 100%; }
            .hero-controls a { flex: 1; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
