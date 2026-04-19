import AppLayout from "@/components/layout/AppLayout";

export default function RegisterFile() {
  return (
    <AppLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Register New File</h1>
        <p style={{ color: 'var(--text-muted)' }}>Enter the physical document details into the central tracker.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">File Title / Description</label>
            <input type="text" className="input-field" placeholder="e.g. Mazda Axela CR Book - K.A. Perera" required />
          </div>

          <div className="input-group">
            <label className="input-label">File Type</label>
            <select className="input-field" required>
              <option value="">Select File Type...</option>
              <option value="CR">CR Book</option>
              <option value="LEASING">Leasing File</option>
              <option value="LEGAL">Legal Document</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Customer NIC</label>
            <input type="text" className="input-field" placeholder="National Identity Card No" required />
          </div>

          <div className="input-group">
            <label className="input-label">Leasing / CR Number</label>
            <input type="text" className="input-field" placeholder="Enter Registration No." />
          </div>

          <div className="input-group">
            <label className="input-label">Vehicle Number (if applicable)</label>
            <input type="text" className="input-field" placeholder="e.g. CAB-4921" />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            <label className="input-label">Tracking Priority</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="priority" value="LOW" defaultChecked />
                Normal
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="priority" value="MEDIUM" />
                <span style={{ color: 'var(--warning-color)', fontWeight: 600 }}>Medium (Expedite)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="priority" value="HIGH" />
                <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>Urgent (Same Day)</span>
              </label>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <label className="input-label">Initial Comments (Optional)</label>
            <textarea className="input-field" rows={3} placeholder="Any notes regarding the condition of the physical document..."></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn" style={{ border: '1px solid var(--border-color)' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Register Document
            </button>
          </div>

        </form>
      </div>
    </AppLayout>
  );
}
