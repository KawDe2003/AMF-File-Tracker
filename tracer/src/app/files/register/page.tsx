"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterFile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    fileType: '',
    nic: '',
    leasingCRNo: '',
    vehicleNo: '',
    priority: 'LOW',
    comments: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to register file');

      setStatus({ type: 'success', message: 'Document registered successfully!' });
      // Redirect or reset form
      setTimeout(() => router.push('/files'), 1500);
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <AppLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Register New File</h1>
        <p style={{ color: 'var(--text-muted)' }}>Enter the physical document details into the central tracker.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">File Title / Description</label>
            <input 
              type="text" 
              name="title"
              className="input-field" 
              placeholder="e.g. Mazda Axela CR Book - K.A. Perera" 
              required 
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">File Type</label>
            <select 
              name="fileType"
              className="input-field" 
              required
              value={formData.fileType}
              onChange={handleChange}
            >
              <option value="">Select File Type...</option>
              <option value="CR">CR Book</option>
              <option value="LEASING">Leasing File</option>
              <option value="LEGAL">Legal Document</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Customer NIC</label>
            <input 
              type="text" 
              name="nic"
              className="input-field" 
              placeholder="National Identity Card No" 
              required 
              value={formData.nic}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Leasing / CR Number</label>
            <input 
              type="text" 
              name="leasingCRNo"
              className="input-field" 
              placeholder="Enter Registration No." 
              value={formData.leasingCRNo}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Vehicle Number (if applicable)</label>
            <input 
              type="text" 
              name="vehicleNo"
              className="input-field" 
              placeholder="e.g. CAB-4921" 
              value={formData.vehicleNo}
              onChange={handleChange}
            />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            <label className="input-label">Tracking Priority</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="priority" value="LOW" checked={formData.priority === 'LOW'} onChange={handleChange} />
                Normal
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="priority" value="MEDIUM" checked={formData.priority === 'MEDIUM'} onChange={handleChange} />
                <span style={{ color: 'var(--warning-color)', fontWeight: 600 }}>Medium (Expedite)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="priority" value="HIGH" checked={formData.priority === 'HIGH'} onChange={handleChange} />
                <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>Urgent (Same Day)</span>
              </label>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <label className="input-label">Initial Comments (Optional)</label>
            <textarea 
              name="comments"
              className="input-field" 
              rows={3} 
              placeholder="Any notes regarding the condition of the physical document..."
              value={formData.comments}
              onChange={handleChange}
            ></textarea>
          </div>

          {status && (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: status.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
              fontWeight: 500,
              textAlign: 'center'
            }}>
              {status.message}
            </div>
          )}

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn" style={{ border: '1px solid var(--border-color)' }} onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={loading}>
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.21-8.58"></path></svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                  Register Document
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </AppLayout>
  );
}
