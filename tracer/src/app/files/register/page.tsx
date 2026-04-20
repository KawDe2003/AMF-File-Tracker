"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CoreRegistrationForm from "@/components/forms/CoreRegistrationForm";

export default function RegisterFile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const today = new Date().toISOString().split('T')[0];

  const initialFormData = {
    financeCompany: 'AMF',
    tagNo: '',
    blNo: '',
    vehicleNo: '',
    engineNo: '',
    chassisNo: '',
    nic: '',
    title: '',
    branchCode: 'METRO',
    marketingOfficer: '',
    fileReceivedDate: today,
    priority: 'MEDIUM',
    fileType: 'LEASING',
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to register file');

      setStatus({ type: 'success', message: 'File registered successfully! Redirecting...' });
      setTimeout(() => router.push('/files'), 1500);
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="registration-container" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '8rem' }}>
        <div className="registration-hero" style={{ marginBottom: '3rem', marginTop: '1rem' }}>
          <div className="hero-content">
            <h1 className="hero-title"><span className="text-gradient">FILE</span> REGISTRATION</h1>
            <p className="hero-desc" style={{ fontSize: '1rem', color: 'var(--slate-500)', fontWeight: 500 }}>Establish high-integrity file record. Operations will proceed to manual verification after commit.</p>
          </div>
          <div className="hero-badge badge badge-success" style={{ padding: '0.5rem 1rem', borderRadius: '50px' }}>
            System Sync Ready
          </div>
        </div>

        {status && (
          <div className={`status-banner ${status.type}`} style={{ 
            padding: '1.25rem', 
            borderRadius: '12px', 
            marginBottom: '2rem', 
            fontWeight: 700, 
            textAlign: 'center',
            background: status.type === 'success' ? '#ecfdf5' : '#fff1f2',
            color: status.type === 'success' ? '#047857' : '#be123c',
            border: `1px solid ${status.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            {status.message}
          </div>
        )}

        <CoreRegistrationForm 
          initialData={initialFormData} 
          onSubmit={handleSubmit} 
          onCancel={() => router.back()} 
          loading={loading}
        />
      </div>

      <style>{`
        .registration-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .hero-title {
          font-size: 2.25rem;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .hero-desc {
          max-width: 600px;
        }

        @media (max-width: 768px) {
          .registration-hero { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </AppLayout>
  );
}

