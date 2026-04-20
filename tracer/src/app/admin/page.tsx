import AppLayout from "@/components/layout/AppLayout";
import prisma from "@/lib/prisma";
import ToastButton from "@/components/ui/ToastButton";

export default async function AdminPanel() {
  const users = await prisma.user.findMany({
    include: { department: true }
  });
  const departments = await prisma.department.findMany();
  
  return (
    <AppLayout>
      <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="admin-hero">
          <div className="hero-lead">
            <h1 className="hero-title">Command <span>Headquarters</span></h1>
            <p className="hero-desc">Orchestrate system-wide protocols, personnel access, and global branch indexing.</p>
          </div>
          <div className="hero-actions">
            <ToastButton className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }} successMessage="Protocol definitions successfully standardized across all cluster nodes.">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: '6px'}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Standardize Protocol
            </ToastButton>
          </div>
        </div>

        <div className="admin-matrix">
          {/* Section 1: Strategic Personnel */}
          <div className="card admin-node">
            <div className="node-header">
              <div className="node-info">
                <h3 className="node-title">Personnel Roster</h3>
                <p className="node-subtitle">Authorized system operators and role hierarchies</p>
              </div>
              <ToastButton className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }} successMessage="Provisional entry gateway initialized. Authentication window open for 5 minutes.">Provisional Entry</ToastButton>
            </div>
            
            <div className="personnel-scroll">
              {users.length === 0 ? (
                <div className="void-state">No active nodes detected.</div>
              ) : users.map((u) => (
                <div key={u.id} className="personnel-card">
                  <div className="p-avatar-wrap">
                    <div className="p-avatar">{u.name.substring(0, 2).toUpperCase()}</div>
                    <div className="p-status-dot online" />
                  </div>
                  <div className="p-details">
                    <span className="p-name">{u.name}</span>
                    <span className="p-email">{u.email}</span>
                  </div>
                  <div className="p-tags">
                    <span className={`p-role-badge ${u.role === 'ADMIN' ? 'gold' : 'silver'}`}>{u.role}</span>
                    <span className="p-dept-code">{u.department?.name.substring(0, 3).toUpperCase() || 'SYS'}</span>
                  </div>
                  <ToastButton className="btn btn-outline btn-icon" style={{ width: '28px', height: '28px', padding: 0 }} successMessage={`Access logs and permissions indexed for ${u.name}.`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </ToastButton>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Infrastructure Matrix */}
          <div className="card admin-node">
            <div className="node-header">
              <div className="node-info">
                <h3 className="node-title">Infrastructure Matrix</h3>
                <p className="node-subtitle">Active document nodes and departmental silos</p>
              </div>
              <ToastButton className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }} successMessage="Infrastructure nodes forcibly synchronized with global registry.">Sync Nodes</ToastButton>
            </div>

            <div className="infrastructure-grid">
              {departments.length === 0 ? (
                <div className="void-state">Infrastructure map offline.</div>
              ) : departments.map((d) => (
                <div key={d.id} className="infra-card">
                  <div className="infra-icon-bg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <div className="infra-content">
                    <span className="infra-name">{d.name}</span>
                    <span className="infra-id">ID: {d.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="infra-visual">
                    <div className="v-bar" style={{ height: '40%' }} />
                    <div className="v-bar" style={{ height: '70%' }} />
                    <div className="v-bar" style={{ height: '30%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="node-footer">
               <div className="system-health">
                  <span className="sh-label">Node Integrity</span>
                  <div className="sh-bar"><div className="sh-progress" style={{ width: '94%' }} /></div>
                  <span className="sh-val">94%</span>
               </div>
            </div>
          </div>
        </div>

        <style>{`
          .admin-hero { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding: 1rem 0; }
          .hero-title { font-size: 1.75rem; color: var(--text-main); margin: 0 0 0.25rem 0; line-height: 1; }
          .hero-title span { color: var(--primary-color); }
          .hero-desc { color: var(--text-muted); font-size: 0.95rem; margin: 0; max-width: 600px; }

          .admin-matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
          
          .admin-node { padding: 0; overflow: hidden; display: flex; flex-direction: column; background: #ffffff; }
          .node-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: flex-start; background: #f8fafc; }
          .node-title { font-size: 1rem; color: var(--text-main); margin: 0; font-weight: 700; }
          .node-subtitle { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem; }

          .personnel-scroll { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; max-height: 500px; overflow-y: auto; }
          .personnel-card { 
             display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; 
             background: #f8fafc; border: 1px solid var(--border-color); 
             border-radius: 8px; transition: all 0.15s;
          }
          .personnel-card:hover { background: #f1f5f9; border-color: #cbd5e1; }

          .p-avatar-wrap { position: relative; }
          .p-avatar { 
             width: 36px; height: 36px; border-radius: 8px; background: var(--primary-color);
             display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem;
          }
          .p-status-dot { position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border: 2px solid white; border-radius: 50%; }
          .p-status-dot.online { background: var(--success-color); }

          .p-details { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
          .p-name { color: var(--text-main); font-weight: 600; font-size: 0.85rem; }
          .p-email { color: var(--text-muted); font-size: 0.7rem; }

          .p-tags { display: flex; gap: 0.5rem; align-items: center; }
          .p-role-badge { 
             padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.6rem; font-weight: 700; 
             text-transform: uppercase; letter-spacing: 0.05em;
          }
          .p-role-badge.gold { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
          .p-role-badge.silver { background: #f1f5f9; color: var(--text-muted); border: 1px solid var(--border-color); }
          .p-dept-code { font-family: monospace; font-size: 0.65rem; color: var(--primary-color); font-weight: 700; background: #eff6ff; padding: 0.1rem 0.3rem; border-radius: 4px; }

          .btn-icon { display: flex; align-items: center; justify-content: center; border-radius: 4px; }

          .infrastructure-grid { padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
          .infra-card { 
             display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; 
             background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;
             transition: all 0.15s; position: relative; overflow: hidden;
          }
          .infra-card:hover { border-color: #cbd5e1; background: #f1f5f9; }
          
          .infra-icon-bg { 
             width: 32px; height: 32px; border-radius: 6px; background: #e0f2fe;
             display: flex; align-items: center; justify-content: center; color: var(--accent-color);
          }
          .infra-content { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
          .infra-name { color: var(--text-main); font-weight: 600; font-size: 0.8rem; }
          .infra-id { font-size: 0.65rem; color: var(--text-muted); font-family: monospace; }

          .infra-visual { display: flex; gap: 2px; align-items: flex-end; height: 20px; opacity: 0.4; }
          .v-bar { width: 3px; background: var(--accent-color); border-radius: 1px; }

          .node-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); background: #f8fafc; }
          .system-health { display: flex; align-items: center; gap: 1rem; }
          .sh-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; white-space: nowrap; }
          .sh-bar { flex: 1; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
          .sh-progress { height: 100%; background: var(--primary-color); }
          .sh-val { font-family: monospace; font-size: 0.7rem; color: var(--text-main); font-weight: 700; }

          .void-state { padding: 2rem; text-align: center; font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 768px) {
            .admin-hero { flex-direction: column; align-items: flex-start; gap: 1rem; }
            .hero-actions { width: 100%; }
            .hero-actions button { width: 100%; justify-content: center; }
            .admin-matrix { grid-template-columns: 1fr; }
            .infrastructure-grid { grid-template-columns: 1fr; }
          }

          @media (max-width: 480px) {
            .hero-title { font-size: 1.4rem; }
          }

        `}</style>
      </div>
    </AppLayout>
  );
}
