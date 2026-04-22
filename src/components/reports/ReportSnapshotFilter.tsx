"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function ReportSnapshotFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = new Date().toISOString().split('T')[0];
  const activeDate = searchParams.get("date") || currentDate;
  
  const [date, setDate] = useState(activeDate);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const params = new URLSearchParams(searchParams);
    if (newDate === currentDate) {
      params.delete("date");
    } else {
      params.set("date", newDate);
    }
    router.push(`/reports?${params.toString()}`);
  };

  return (
    <div className="snapshot-selector card">
      <div className="ss-icon-wrap">
        <Calendar size={18} />
      </div>
      <div className="ss-content">
        <label className="ss-label">Operational Snapshot</label>
        <div className="ss-input-group">
          <span className="ss-prefix">As At:</span>
          <input 
            type="date" 
            value={date}
            max={currentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="ss-input"
          />
        </div>
      </div>

      <style>{`
        .snapshot-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.25rem;
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          width: fit-content;
        }
        
        .ss-icon-wrap {
          width: 40px;
          height: 40px;
          background: #eff6ff;
          color: var(--primary-color);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ss-content { display: flex; flex-direction: column; }
        .ss-label { font-size: 0.65rem; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.15rem; }
        
        .ss-input-group { display: flex; align-items: center; gap: 0.5rem; }
        .ss-prefix { font-size: 0.85rem; font-weight: 700; color: var(--slate-900); }
        
        .ss-input {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-color);
          cursor: pointer;
          outline: none;
        }
        
        .ss-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(30%) sepia(90%) animate(hue-rotate(200deg));
        }
      `}</style>
    </div>
  );
}
