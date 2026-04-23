import { useState } from "react";
import {
  Building2,
  Hash,
  Binary,
  Car,
  Cog,
  Cpu,
  User,
  Type,
  MapPin,
  UserCircle,
  Zap,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface CoreRegistrationFormProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CoreRegistrationForm({
  initialData,
  onSubmit,
  onCancel,
  loading
}: CoreRegistrationFormProps) {
  const [formData, setFormData] = useState({
    ...initialData,
    financeCompany: initialData.financeCompany || 'AMF',
    tagNo: initialData.tagNo || '',
    blNo: initialData.blNo || '',
    vehicleNo: initialData.vehicleNo || '',
    engineNo: initialData.engineNo || '',
    chassisNo: initialData.chassisNo || '',
    nic: initialData.nic || '',
    branchCode: initialData.branchCode || 'METRO',
    marketingOfficer: initialData.marketingOfficer || '',
    priority: initialData.priority || 'MEDIUM',
    title: initialData.title || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="premium-form-container">
      <div className="card card-elevated">
        <div className="form-header">
          <div className="fh-text">
            <h3 className="text-gradient">File Registration</h3>
            <p className="fh-meta">Enter mandatory identifiers to establish system record.</p>
          </div>
          <div className="fh-indicator">
            <Zap size={14} />
            <span>High Impact</span>
          </div>
        </div>

        <div className="form-grid">
          <div className="field-group">
            <label className="field-label">1. Finance Company <span className="req">*</span></label>
            <div className="input-with-icon">
              <Building2 className="input-icon" size={16} />
              <select name="financeCompany" value={formData.financeCompany} onChange={handleChange} className="field-select" required>
                <option value="AMF">AMF</option>
                <option value="LB">LB</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">2. Tag Number <span className="req">*</span></label>
            <div className="input-with-icon">
              <Hash className="input-icon" size={16} />
              <input type="text" name="tagNo" className="field-input" placeholder="Month/REF" value={formData.tagNo} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">3. BL Number <span className="req">*</span></label>
            <div className="input-with-icon">
              <Binary className="input-icon" size={16} />
              <input type="text" name="blNo" className="field-input" placeholder="BL-XXXXX" value={formData.blNo} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">4. Vehicle No <span className="req">*</span></label>
            <div className="input-with-icon">
              <Car className="input-icon" size={16} />
              <input type="text" name="vehicleNo" className="field-input" placeholder="BHE-1234 / U/R" value={formData.vehicleNo} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">5. Engine Number <span className="req">*</span></label>
            <div className="input-with-icon">
              <Cog className="input-icon" size={16} />
              <input type="text" name="engineNo" className="field-input" placeholder="E-XXXXXXX" value={formData.engineNo} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">6. Chassis Number <span className="req">*</span></label>
            <div className="input-with-icon">
              <Cpu className="input-icon" size={16} />
              <input type="text" name="chassisNo" className="field-input" placeholder="C-XXXXXXX" value={formData.chassisNo} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">7. National ID (NIC) <span className="req">*</span></label>
            <div className="input-with-icon">
              <UserCircle className="input-icon" size={16} />
              <input type="text" name="nic" className="field-input" placeholder="Enter NIC" value={formData.nic} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">8. Legal Subject Name <span className="req">*</span></label>
            <div className="input-with-icon">
              <Type className="input-icon" size={16} />
              <input type="text" name="title" className="field-input" placeholder="Full Name" value={formData.title} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Operational Branch</label>
            <div className="input-with-icon">
              <MapPin className="input-icon" size={16} />
              <select name="branchCode" value={formData.branchCode} onChange={handleChange} className="field-select">
                {['METRO', 'MTR', 'MIN', 'KOT', 'ANP', 'MLP', 'KND', 'IFU', 'MUL', 'NRM', 'MTU', 'BAU'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Marketing Officer</label>
            <div className="input-with-icon">
              <User className="input-icon" size={16} />
              <input type="text" name="marketingOfficer" className="field-input" placeholder="Full Name" value={formData.marketingOfficer} onChange={handleChange} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Initial Entry Date</label>
            <div className="input-with-icon">
              <Calendar className="input-icon" size={16} />
              <input type="date" name="fileReceivedDate" className="field-input" value={formData.fileReceivedDate} readOnly style={{ opacity: 0.7, background: 'var(--slate-50)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-outline btn-lg" onClick={onCancel} disabled={loading}>
          Abort Operation
        </button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Initializing...' : (
            <>
              <CheckCircle2 size={18} />
              Verify & Commit Record
            </>
          )}
        </button>
      </div>

      <style>{`
        .premium-form-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--slate-100);
        }

        .fh-text h3 { font-size: 1.5rem; margin-bottom: 0.25rem; }
        .fh-meta { font-size: 0.85rem; color: var(--slate-500); font-weight: 500; }

        .fh-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #eff6ff;
          color: var(--primary-color);
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid #dbeafe;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--slate-400);
          pointer-events: none;
        }

        .input-with-icon .field-input,
        .input-with-icon .field-select {
          padding-left: 2.75rem;
        }

        .req { color: var(--danger-color); font-weight: 800; margin-left: 2px; }

        .action-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .btn-lg {
          padding: 0.85rem 2.5rem;
          border-radius: 14px;
          font-size: 0.95rem;
        }

        @media (max-width: 480px) {
          .action-row { flex-direction: column; width: 100%; justify-content: stretch; }
          .action-row button { width: 100%; }
        }
      `}</style>
    </form>
  );
}
