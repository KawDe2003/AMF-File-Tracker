import AppLayout from "@/components/layout/AppLayout";

export default function FileDirectory() {
  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>File Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse and manage all physical documents in the system.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Register New File
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Filters and Actions */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, flexDirection: 'row', alignItems: 'center', maxWidth: '300px' }}>
            <svg style={{ color: 'var(--text-muted)', position: 'absolute', marginLeft: '12px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" className="input-field" placeholder="Search files..." style={{ paddingLeft: '2.5rem', width: '100%' }} />
          </div>
          
          <select className="input-field" style={{ minWidth: '150px' }}>
            <option value="">All Categories</option>
            <option value="CR">CR Books</option>
            <option value="LEASING">Leasing Files</option>
            <option value="LEGAL">Legal Documents</option>
          </select>
          
          <select className="input-field" style={{ minWidth: '150px' }}>
            <option value="">All Statuses</option>
            <option value="AT_BRANCH">At Branch</option>
            <option value="IN_TRANSIT">In Transit</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>File Ref No</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Current Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'CR-74892', type: 'CR Book', loc: 'City Branch', status: 'AT_BRANCH', badge: 'badge-info', p: 'HIGH' },
                { ref: 'LN-10294', type: 'Leasing File', loc: 'Head Office', status: 'IN_TRANSIT', badge: 'badge-warning', p: 'MEDIUM' },
                { ref: 'LGL-9938', type: 'Legal Doc', loc: 'Legal Dept', status: 'AT_BRANCH', badge: 'badge-info', p: 'LOW' }
              ].map((file, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>{file.ref}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{file.type}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{file.loc}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${file.badge}`}>{file.status.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      color: file.p === 'HIGH' ? 'var(--danger-color)' : file.p === 'MEDIUM' ? 'var(--warning-color)' : 'var(--text-muted)' 
                    }}>
                      {file.p}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--border-color)' }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div>Showing 1 to 3 of 12,450 entries</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.25rem 0.5rem' }} disabled>Previous</button>
            <button className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.25rem 0.75rem' }}>Next</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
