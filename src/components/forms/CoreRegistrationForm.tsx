import { useState } from "react";
import { Zap as ZapIcon } from 'lucide-react';
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

  const [activeSection, setActiveSection] = useState<'ASSET' | 'IDENTITY' | 'OPS'>('ASSET');

  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<{ tagNo: boolean, vehicleNo: boolean }>({ tagNo: false, vehicleNo: false });

  useEffect(() => {
    // Fetch last 3 files registered by this user
    fetch('/api/files?limit=3').then(r => r.json()).then(data => {
      setRecentFiles(Array.isArray(data) ? data.slice(0, 3) : []);
    }).catch(() => {});
  }, []);

  // Duplicate Check Logic
  useEffect(() => {
    const checkDuplicates = async () => {
      if (formData.tagNo.length < 3 && formData.vehicleNo.length < 3) return;
      
      try {
        const res = await fetch(`/api/files/check-duplicates?tagNo=${formData.tagNo}&vehicleNo=${formData.vehicleNo}`);
        const data = await res.json();
        setDuplicates(data);
      } catch (err) {}
    };

    const timer = setTimeout(checkDuplicates, 500);
    return () => clearTimeout(timer);
  }, [formData.tagNo, formData.vehicleNo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="registry-form-layout">
      {/* Left Navigation Sidebar */}
      <aside className="registry-sidebar">
        <div className="sidebar-group">
          <p className="group-label">Registration Flow</p>
          <nav className="nav-stack">
            <button type="button" onClick={() => setActiveSection('ASSET')} className={`nav-item ${activeSection === 'ASSET' ? 'active' : ''}`}>
              <div className="nav-icon"><Car size={16} /></div>
              <span>Asset Identity</span>
              {formData.tagNo && formData.vehicleNo && <CheckCircle2 className="done-icon" size={14} />}
            </button>
            <button type="button" onClick={() => setActiveSection('IDENTITY')} className={`nav-item ${activeSection === 'IDENTITY' ? 'active' : ''}`}>
              <div className="nav-icon"><User size={16} /></div>
              <span>Legal Subject</span>
              {formData.title && formData.nic && <CheckCircle2 className="done-icon" size={14} />}
            </button>
            <button type="button" onClick={() => setActiveSection('OPS')} className={`nav-item ${activeSection === 'OPS' ? 'active' : ''}`}>
              <div className="nav-icon"><Building2 size={16} /></div>
              <span>Operational Info</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-summary card">
          <p className="summary-title">Recently Registered</p>
          <div className="recent-list">
            {recentFiles.length > 0 ? recentFiles.map(rf => (
              <div key={rf.id} className="recent-item">
                <p className="ri-title">{rf.title || 'Untitled'}</p>
                <p className="ri-meta">{rf.tagNo || 'No Tag'}</p>
              </div>
            )) : (
              <p className="empty-msg">No recent entries found.</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Form Content */}
      <div className="registry-main">
        {activeSection === 'ASSET' && (
          <div className="section-card card animate-slide-fade">
            <div className="section-header">
              <h3 className="text-gradient">Asset Identification</h3>
              <p>Core identifiers for the physical collateral.</p>
            </div>
            <div className="form-grid">
              <div className="field-group">
                <label className="field-label">Finance Company <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Building2 className="input-icon" size={16} />
                  <select name="financeCompany" value={formData.financeCompany} onChange={handleChange} className="field-select" required>
                    <option value="AMF">AMF</option>
                    <option value="LB">LB</option>
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Tag Number <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Hash className={`input-icon ${duplicates.tagNo ? 'text-danger' : ''}`} size={16} />
                  <input 
                    type="text" 
                    name="tagNo" 
                    className={`field-input ${duplicates.tagNo ? 'border-danger' : ''}`} 
                    placeholder="Month/REF" 
                    value={formData.tagNo} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                {duplicates.tagNo && <p className="field-error">Warning: This Tag No already exists!</p>}
              </div>
              <div className="field-group">
                <label className="field-label">BL Number <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Binary className="input-icon" size={16} />
                  <input type="text" name="blNo" className="field-input" placeholder="BL-XXXXX" value={formData.blNo} onChange={handleChange} required />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Vehicle No <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Car className={`input-icon ${duplicates.vehicleNo ? 'text-danger' : ''}`} size={16} />
                  <input 
                    type="text" 
                    name="vehicleNo" 
                    className={`field-input ${duplicates.vehicleNo ? 'border-danger' : ''}`} 
                    placeholder="BHE-1234" 
                    value={formData.vehicleNo} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                {duplicates.vehicleNo && <p className="field-error">Warning: Vehicle No already registered!</p>}
              </div>
              <div className="field-group">
                <label className="field-label">Engine Number</label>
                <div className="input-with-icon">
                  <Cog className="input-icon" size={16} />
                  <input type="text" name="engineNo" className="field-input" placeholder="E-XXXXXXX" value={formData.engineNo} onChange={handleChange} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Chassis Number</label>
                <div className="input-with-icon">
                  <Cpu className="input-icon" size={16} />
                  <input type="text" name="chassisNo" className="field-input" placeholder="C-XXXXXXX" value={formData.chassisNo} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="section-footer">
              <button type="button" className="btn btn-primary" onClick={() => setActiveSection('IDENTITY')}>Next: Personal Info</button>
            </div>
          </div>
        )}

        {activeSection === 'IDENTITY' && (
          <div className="section-card card animate-slide-fade">
            <div className="section-header">
              <h3 className="text-gradient">Personal Profile</h3>
              <p>Ownership and identity verification data.</p>
            </div>
            <div className="form-grid">
              <div className="field-group full">
                <label className="field-label">Full Name (Legal Subject)</label>
                <div className="input-with-icon">
                  <Type className="input-icon" size={16} />
                  <input type="text" name="title" className="field-input" placeholder="Enter Full Name" value={formData.title} onChange={handleChange} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">National ID (NIC)</label>
                <div className="input-with-icon">
                  <UserCircle className="input-icon" size={16} />
                  <input type="text" name="nic" className="field-input" placeholder="Enter NIC" value={formData.nic} onChange={handleChange} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">File Category</label>
                <select name="fileType" value={formData.fileType} onChange={handleChange} className="field-select">
                  <option value="LEASING">Leasing</option>
                  <option value="CR">CR Book</option>
                  <option value="LEGAL">Legal</option>
                </select>
              </div>
            </div>
            <div className="section-footer">
              <button type="button" className="btn btn-outline" onClick={() => setActiveSection('ASSET')}>Previous</button>
              <button type="button" className="btn btn-primary" onClick={() => setActiveSection('OPS')}>Next: Operations</button>
            </div>
          </div>
        )}

        {activeSection === 'OPS' && (
          <div className="section-card card animate-slide-fade">
            <div className="section-header">
              <h3 className="text-gradient">Operations & Logistics</h3>
              <p>Branch allocation and internal routing metadata.</p>
            </div>
            <div className="form-grid">
              <div className="field-group">
                <label className="field-label">Origin Branch</label>
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
                  <input type="text" name="marketingOfficer" className="field-input" placeholder="Officer Name" value={formData.marketingOfficer} onChange={handleChange} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Priority Level</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="field-select">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="section-footer">
              <button type="button" className="btn btn-outline" onClick={() => setActiveSection('IDENTITY')}>Previous</button>
              <button type="submit" className="btn btn-primary btn-glow" disabled={loading}>
                {loading ? 'Committing...' : 'Finalize & Commit Record'}
              </button>
            </div>
          </div>
        )}

        <div className="global-form-actions">
           <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Abort Registry</button>
        </div>
      </div>
    </form>
  );
}
