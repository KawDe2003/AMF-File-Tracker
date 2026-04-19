import AppLayout from "@/components/layout/AppLayout";

export default function Approvals() {
  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Manager Approvals</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and authorize pending physical file transfers across departments.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <button className="btn btn-primary" style={{ border: '1px solid var(--primary-color)' }}>Pending Requests (4)</button>
        <button className="btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>History Log</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>File Details</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Movement Route</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Requested By</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'CR-49210', title: 'Toyota Aqua CR - K.M. Perera', from: 'City Branch', to: 'Credit Dept', user: 'S. Fernando', time: '10 mins ago', p: 'HIGH' },
                { ref: 'LN-11204', title: 'Leasing File - A.B. Silva', from: 'Head Office', to: 'Legal Dept', user: 'N. Kasun', time: '1 hour ago', p: 'MEDIUM' },
                { ref: 'LGL-9214', title: 'Property Deed - AMF/HQ', from: 'Legal Dept', to: 'Vault', user: 'A. De Silva', time: '2 hours ago', p: 'LOW' }
              ].map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.ref}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{item.title}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500 }}>{item.from}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      <span style={{ fontWeight: 500 }}>{item.to}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div>{item.user}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                     <span style={{ 
                      color: item.p === 'HIGH' ? 'var(--danger-color)' : item.p === 'MEDIUM' ? 'var(--warning-color)' : 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {item.p}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
