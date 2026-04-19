"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";

export default function Approvals() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovements() {
      try {
        const res = await fetch('/api/approvals');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMovements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovements();
  }, []);

  const handleDecision = async (movementId: string, decision: 'APPROVE' | 'REJECT') => {
    setProcessing(movementId);
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movementId,
          decision,
          managerId: 'mock-manager-id', // Would be from auth in a real system
          comments: decision === 'APPROVE' ? 'Approved through dashboard' : 'Rejected through dashboard'
        }),
      });

      if (!res.ok) throw new Error('Failed to process decision');

      // Remove from list
      setMovements(prev => prev.filter(m => m.id !== movementId));
    } catch (err) {
      alert('Error processing decision');
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };
  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Manager Approvals</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and authorize pending physical file transfers across departments.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <button className="btn btn-primary" style={{ border: '1px solid var(--primary-color)' }}>
          Pending Requests ({movements.length})
        </button>
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
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <svg style={{ animation: 'spin 1s linear infinite' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.21-8.58"></path></svg>
                      <span style={{ color: 'var(--text-muted)' }}>Loading pending requests...</span>
                    </div>
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pending approval requests found.
                  </td>
                </tr>
              ) : movements.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.file.id.substring(0, 8)}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{item.file.title}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500 }}>{item.fromDept.name}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      <span style={{ fontWeight: 500 }}>{item.toDept.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div>{item.sender.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                     <span style={{ 
                      color: item.file.priority === 'HIGH' ? 'var(--danger-color)' : item.file.priority === 'MEDIUM' ? 'var(--warning-color)' : 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {item.file.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn" 
                        style={{ padding: '0.5rem', color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}
                        disabled={processing === item.id}
                        onClick={() => handleDecision(item.id, 'REJECT')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem' }}
                        disabled={processing === item.id}
                        onClick={() => handleDecision(item.id, 'APPROVE')}
                      >
                        {processing === item.id ? (
                           <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.21-8.58"></path></svg>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Approve
                          </>
                        )}
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
