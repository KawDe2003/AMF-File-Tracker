"use client";

import { useState } from "react";

interface KycFormProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
  isUpdate?: boolean;
  mode?: 'customer' | 'guarantor';
}

export default function KycForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading, 
  submitLabel = "Submit KYC Form", 
  isUpdate = false,
  mode = 'customer'
}: KycFormProps) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Helper to determine field name based on mode
  const f = (customerName: string, guarantorName: string) => mode === 'customer' ? customerName : guarantorName;
  const isGuarantor = mode === 'guarantor';

  return (
    <form onSubmit={handleSubmit} className="kyc-form-layout">
      {/* Section 1: Core Identifiers */}
      <div className="card module-card">
        <div className="module-header">
          <h3 className="module-name">{isGuarantor ? 'Guarantor Identification' : 'Core Asset & File Identity'}</h3>
          <span className="module-step">Section 01</span>
        </div>
        
        <div className="form-grid">
          <div className="field-group">
            <label className="field-label">1. Finance Company <span style={{color: '#e11d48'}}>*</span></label>
            <select name="financeCompany" value={formData.financeCompany} onChange={handleChange} className="field-select" disabled={isGuarantor || isUpdate} required>
              <option value="AMF">AMF</option>
              <option value="LB">LB</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">2. Tag Number <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name="tagNo" className="field-input" placeholder="Enter Tag No" value={formData.tagNo} onChange={handleChange} required disabled={isGuarantor || isUpdate} />
          </div>

          <div className="field-group">
            <label className="field-label">3. BL Number <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name="blNo" className="field-input" placeholder="Enter BL No" value={formData.blNo} onChange={handleChange} required disabled={isGuarantor || isUpdate} />
          </div>

          <div className="field-group">
            <label className="field-label">4. Vehicle No <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name="vehicleNo" className="field-input" placeholder="e.g. BHE1234 or U/R" value={formData.vehicleNo} onChange={handleChange} required disabled={isGuarantor || isUpdate} />
          </div>

          <div className="field-group">
            <label className="field-label">5. Engine Number <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name="engineNo" className="field-input" placeholder="Enter Engine No" value={formData.engineNo} onChange={handleChange} required disabled={isGuarantor || isUpdate} />
          </div>

          <div className="field-group">
            <label className="field-label">6. Chassis Number <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name="chassisNo" className="field-input" placeholder="Enter Chassis No" value={formData.chassisNo} onChange={handleChange} required disabled={isGuarantor || isUpdate} />
          </div>

          <div className="field-group">
            <label className="field-label">File Received Date</label>
            <input type="date" name="fileReceivedDate" className="field-input" value={formData.fileReceivedDate} readOnly style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
          </div>

          <div className="field-group">
            <label className="field-label">Branch Code</label>
            <select name="branchCode" value={formData.branchCode} onChange={handleChange} className="field-select" disabled={isGuarantor}>
              {['METRO', 'MTR', 'MIN', 'KOT', 'ANP', 'MLP', 'KND', 'IFU', 'MUL', 'NRM', 'MTU', 'BAU'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Marketing Officer</label>
            <input type="text" name="marketingOfficer" className="field-input" value={formData.marketingOfficer} onChange={handleChange} disabled={isGuarantor} />
          </div>

          {!isGuarantor && (
            <div className="field-group full">
              <label className="field-label">Customer Full Name (Title) <span style={{color: '#e11d48'}}>*</span></label>
              <input type="text" name="title" className="field-input" placeholder="Enter Full Name" required value={formData.title} onChange={handleChange} disabled={isUpdate} />
            </div>
          )}

          <div className="field-group">
            <label className="field-label">{isGuarantor ? "6. National ID / Passport Number" : "7. National ID / Passport"} <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name={f("nic", "guarantorNic")} className="field-input" value={formData[f("nic", "guarantorNic")]} onChange={handleChange} required disabled={isUpdate && !isGuarantor} />
          </div>

          {!isGuarantor && (
            <div className="field-group">
              <label className="field-label">Registration Type</label>
              <div className="radio-group" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label><input type="radio" name="regUnreg" value="REG" checked={formData.regUnreg === 'REG'} onChange={handleChange} /> Registered</label>
                <label><input type="radio" name="regUnreg" value="UNREG" checked={formData.regUnreg === 'UNREG'} onChange={handleChange} /> Unregistered</label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Residential & Contact */}
      <div className="card module-card">
        <div className="module-header">
          <h3 className="module-name">{isGuarantor ? 'Guarantor Residence & Contact' : 'Residence & Connectivity'}</h3>
          <span className="module-step">Section 02</span>
        </div>
        <div className="form-grid">
          <div className="field-group full">
            <label className="field-label">7. Current Residential Address</label>
            <textarea name={f("address", "guarantorAddress")} className="field-input" style={{ minHeight: '80px' }} value={formData[f("address", "guarantorAddress")]} onChange={handleChange} placeholder="Mention 'Correct' or enter new address..." />
          </div>
          <div className="field-group">
            <label className="field-label">8. Type of Residence</label>
            <select name={f("residenceType", "guarantorResidenceType")} value={formData[f("residenceType", "guarantorResidenceType")]} onChange={handleChange} className="field-select">
              <option value="Owned by self">Owned by self</option>
              <option value="Rented">Rented</option>
              <option value="Parental home">Parental home</option>
              <option value="Company provided">Company provided</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">9. Contact Number ( Call Connected No ) <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name={f("contactNo", "guarantorContactNo")} className="field-input" value={formData[f("contactNo", "guarantorContactNo")]} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label className="field-label">10. WhatsApp No <span style={{color: '#e11d48'}}>*</span></label>
            <input type="text" name={f("whatsappNo", "guarantorWhatsappNo")} className="field-input" value={formData[f("whatsappNo", "guarantorWhatsappNo")]} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label className="field-label">11. Alternative Contact Number {isGuarantor && <span style={{color: '#e11d48'}}>*</span>}</label>
            <input type="text" name={f("altContactNo", "guarantorAltContactNo")} className="field-input" value={formData[f("altContactNo", "guarantorAltContactNo")]} onChange={handleChange} required={isGuarantor} />
          </div>
          <div className="field-group">
            <label className="field-label">12. Best time to call</label>
            <select name={f("bestTimeToCall", "guarantorBestTimeToCall")} value={formData[f("bestTimeToCall", "guarantorBestTimeToCall")]} onChange={handleChange} className="field-select">
              <option value="Morning">Morning (8:00 AM – 12:00 PM)</option>
              <option value="Afternoon">Afternoon (12:00 PM – 4:00 PM)</option>
              <option value="Evening">Evening (4:00 PM – 8:00 PM)</option>
              <option value="Anytime">Anytime</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Employment */}
      <div className="card module-card">
        <div className="module-header">
          <h3 className="module-name">{isGuarantor ? 'Guarantor Employment Profile' : 'Professional & Economic Profile'}</h3>
          <span className="module-step">Section 03</span>
        </div>
        <div className="form-grid">
          <div className="field-group">
            <label className="field-label">13. Employment Type</label>
            <select name={f("employmentType", "guarantorEmploymentType")} value={formData[f("employmentType", "guarantorEmploymentType")]} onChange={handleChange} className="field-select">
              <option value="Salaried">Salaried</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Pensioner">Pensioner</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">14. {isGuarantor ? 'Name of Employer / Business Name' : 'Employer / Business Name & Address'}</label>
            <input type="text" name={f("employerName", "guarantorEmployerName")} className="field-input" value={formData[f("employerName", "guarantorEmployerName")]} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">15. {isGuarantor ? 'Job Title / Position and EMP NO' : 'Job Title & EMP NO'}</label>
            <input type="text" name={f("jobTitle", "guarantorJobTitle")} className="field-input" value={formData[f("jobTitle", "guarantorJobTitle")]} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">16. Economic Sector</label>
            <select name={f("economicSector", "guarantorEconomicSector")} value={formData[f("economicSector", "guarantorEconomicSector")]} onChange={handleChange} className="field-select">
              {[
                "Agriculture, Forestry & Fishing", "Manufacturing", "Tourism", "Transportation & Storage",
                "Construction & Infrastructure Development", "Wholesale & Retail Trade", "Information Technology and Communication",
                "Financial Services", "Professional, Scientific & Technical Activities", "Arts, Entertainment & Recreation",
                "Education", "Health Care, Social Services & Support Services", "Consumption Loans",
                "Sri Lanka Government/Sri Lanka Government Institutions"
              ].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">17. Salary Date</label>
            <input type="text" name={f("salaryDate", "guarantorSalaryDate")} className="field-input" placeholder="e.g. 25th" value={formData[f("salaryDate", "guarantorSalaryDate")]} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">18. {isGuarantor ? 'Work Experience: (How many years in the current job?)' : 'Work Experience (Years)'}</label>
            <input type="text" name={f("workExperience", "guarantorWorkExperience")} className="field-input" value={formData[f("workExperience", "guarantorWorkExperience")]} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">19. Monthly Income</label>
            <input type="text" name={f("monthlyIncome", "guarantorMonthlyIncome")} className="field-input" value={formData[f("monthlyIncome", "guarantorMonthlyIncome")]} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">20. Other Income source</label>
            <input type="text" name={f("otherIncome", "guarantorOtherIncome")} className="field-input" value={formData[f("otherIncome", "guarantorOtherIncome")]} onChange={handleChange} />
          </div>
          {isGuarantor && (
            <div className="field-group">
               <label className="field-label">21. Relationship between Customer</label>
               <input type="text" name="guarantorRelationship" className="field-input" value={formData.guarantorRelationship} onChange={handleChange} />
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Family Connectivity (Customer Only) */}
      {!isGuarantor && (
        <div className="card module-card">
          <div className="module-header">
            <h3 className="module-name">Spouse or Relative Details</h3>
            <span className="module-step">Section 04</span>
          </div>
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label">21. Name</label>
              <input type="text" name="spouseName" className="field-input" value={formData.spouseName} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">22. Contact No</label>
              <input type="text" name="spouseContact" className="field-input" value={formData.spouseContact} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">23. Relationship</label>
              <input type="text" name="spouseRelationship" className="field-input" value={formData.spouseRelationship} onChange={handleChange} />
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Asset & Financials (Customer Only) */}
      {!isGuarantor && (
        <div className="card module-card">
          <div className="module-header">
            <h3 className="module-name">Asset Acquisition & Terms</h3>
            <span className="module-step">Section 05</span>
          </div>
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label">24. Bike Make & Model</label>
              <input type="text" name="bikeMakeModel" className="field-input" value={formData.bikeMakeModel} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">25. Requested Grant/Loan</label>
              <input type="text" name="loanAmount" className="field-input" value={formData.loanAmount} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">26. User of the Asset</label>
              <input type="text" name="assetUser" className="field-input" value={formData.assetUser} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">27. Days since received vehicle</label>
              <select name="daysReceivedVehicle" value={formData.daysReceivedVehicle} onChange={handleChange} className="field-select">
                <option value="Less than 3 days">Less than 3 days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="More than 30 days">More than 30 days</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">28. Total Vehicle Price</label>
              <input type="text" name="vehiclePrice" className="field-input" value={formData.vehiclePrice} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">29. Down Payment</label>
              <input type="text" name="downPayment" className="field-input" value={formData.downPayment} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">30. Document Charges</label>
              <input type="text" name="documentCharges" className="field-input" value={formData.documentCharges} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">31. Insurance Company</label>
              <select name="insuranceCompany" value={formData.insuranceCompany} onChange={handleChange} className="field-select">
                <option value="Ceylinco">Ceylinco</option>
                <option value="Fair First">Fair First</option>
                <option value="Cooperative">Cooperative</option>
                <option value="Sanasa">Sanasa</option>
                <option value="Amana">Amana</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Section 6: Outcome & Verification */}
      <div className="card module-card">
        <div className="module-header">
          <h3 className="module-name">{isGuarantor ? 'Guarantor KYC Outcome' : 'KYC Outcome & Verification'}</h3>
          <span className="module-step">Section 06</span>
        </div>
        <div className="form-grid">
          {!isGuarantor && (
            <div className="field-group">
              <label className="field-label">32. Guarantor Relationship</label>
              <input type="text" name="guarantorRelationship" className="field-input" value={formData.guarantorRelationship} onChange={handleChange} />
            </div>
          )}
          
          {!isGuarantor && (
            <div className="field-group">
              <label className="field-label">33. Were other details provided to the client? <span style={{color: '#e11d48'}}>*</span></label>
              <p className="field-desc-small">(Ex: Rental Amount, Due date, Loan Period, Facility Onboarding SMS)</p>
              <select name="detailsProvided" value={formData.detailsProvided} onChange={handleChange} className="field-select" required>
                <option value="">Select an option</option>
                <option value="Yes, all details shared">Yes, all details shared</option>
                <option value="No, details not shared">No, details not shared</option>
                <option value="Follow-up required">Follow-up required (Need to remind)</option>
              </select>
            </div>
          )}

          <div className="field-group">
            <label className="field-label">{isGuarantor ? '22. Rate the guarantor\'s cooperation' : '34. Customer Cooperation (1-5)'} {isGuarantor && <span style={{color: '#e11d48'}}>*</span>}</label>
            <input type="number" 
                   name={f("cooperationRating", "guarantorCooperationRating")} 
                   min="1" max="5" 
                   className="field-input" 
                   value={formData[f("cooperationRating", "guarantorCooperationRating")] || ''} 
                   onChange={handleChange} 
                   required={isGuarantor} />
          </div>

          <div className="field-group">
            <label className="field-label">{isGuarantor ? '23. Guarantor contacted via Inbound or Outbound?' : '35. Customer contacted via Inbound or Outbound?'} <span style={{color: '#e11d48'}}>*</span></label>
            <select name={f("contactType", "guarantorContactType")} value={formData[f("contactType", "guarantorContactType")]} onChange={handleChange} className="field-select" required>
              <option value="">Select an option</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
          </div>

          {isUpdate && (
            <>
              <div className="field-group">
                <label className="field-label">Customer Verification State</label>
                <select name="customerStatus" value={formData.customerStatus} onChange={handleChange} className="field-select">
                    <option value="NOT_STARTED">NOT STARTED</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="NOT_VERIFIED">NOT VERIFIED</option>
                    <option value="UNABLE_TO_CONTACT">UNABLE TO CONTACT</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Guarantor Verification State</label>
                <select name="guarantorStatus" value={formData.guarantorStatus} onChange={handleChange} className="field-select">
                    <option value="NOT_STARTED">NOT STARTED</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="NOT_VERIFIED">NOT VERIFIED</option>
                    <option value="UNABLE_TO_CONTACT">UNABLE TO CONTACT</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">3rd Party Auth State</label>
                <select name="thirdPartyStatus" value={formData.thirdPartyStatus} onChange={handleChange} className="field-select">
                    <option value="PENDING">PENDING</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="NOT_VERIFIED">NOT VERIFIED</option>
                </select>
              </div>
            </>
          )}

          <div className="field-group full">
            <label className="field-label">{isGuarantor ? '24. Special remarks' : '36. Special Remarks'}</label>
            <textarea name={f("specialRemarks", "guarantorSpecialRemarks")} className="field-input" style={{ minHeight: '80px' }} value={formData[f("specialRemarks", "guarantorSpecialRemarks")]} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="kyc-footer">
         <div className="action-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: '#1e40af' }}>
              {loading ? 'Processing...' : submitLabel}
            </button>
         </div>
      </div>

      <style>{`
        .kyc-form-layout { display: flex; flex-direction: column; gap: 2rem; }
        .module-card { padding: 2rem; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
        .module-name { font-size: 1.15rem; color: #1e3a8a; font-weight: 800; }
        .module-step { font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary-color); font-weight: 700; background: #eff6ff; padding: 0.25rem 0.6rem; border-radius: 4px; }
        
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .full { grid-column: 1 / -1; }
        
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .field-input, .field-select {
          background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px;
          padding: 0.85rem 1rem; color: var(--text-main); font-size: 0.95rem; transition: all 0.15s; outline: none; width: 100%;
        }
        .field-input:focus, .field-select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        
        .field-required-hint { font-size: 0.65rem; color: #e11d48; font-weight: 600; margin-top: 0.25rem; }
        .field-desc-small { font-size: 0.65rem; color: var(--text-muted); margin: -0.25rem 0 0.25rem 0; line-height: 1.2; }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}
