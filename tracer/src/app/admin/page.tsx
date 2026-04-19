import AppLayout from "@/components/layout/AppLayout";

export default function AdminPanel() {
  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Admin Configuration</h1>
          <p style={{ color: 'var(--text-muted)' }}>System-wide configurations, departments, and user role management.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Users Section */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>User Management</h3>
             <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Add User</button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'K. Admin', email: 'admin@amf.lk', role: 'ADMIN', dept: 'System' },
                { name: 'S. Fernando', email: 's.fernando@amf.lk', role: 'STAFF', dept: 'City Branch' },
                { name: 'N. Kasun', email: 'n.kasun@amf.lk', role: 'MANAGER', dept: 'Head Office' }
              ].map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>{u.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{u.email}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="badge badge-info">{u.role}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.dept}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Departments & Branches</h3>
             <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Add Branch</button>
          </div>
          <div style={{ padding: '1.5rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'City Branch', code: 'BR-C1' },
                { name: 'Head Office', code: 'HQ' },
                { name: 'Credit Dept', code: 'HQ-CREDIT' },
                { name: 'Legal Dept', code: 'HQ-LEGAL' }
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                     </div>
                     <span style={{ fontWeight: 600 }}>{d.name}</span>
                  </div>
                  <span className="badge" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' }}>{d.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
