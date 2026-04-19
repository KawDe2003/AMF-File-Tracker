"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FileDirectory() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchFiles() {
      try {
        const query = new URLSearchParams();
        if (search) query.append('q', search);
        
        const res = await fetch(`/api/files?${query.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    const timer = setTimeout(fetchFiles, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredFiles = files.filter(file => {
    return (typeFilter === "" || file.fileType === typeFilter) &&
           (statusFilter === "" || file.status === statusFilter);
  });
  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>File Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse and manage all physical documents in the system.</p>
        </div>
        <Link href="/files/register" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Register New File
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Filters and Actions */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, flexDirection: 'row', alignItems: 'center', maxWidth: '300px' }}>
            <svg style={{ color: 'var(--text-muted)', position: 'absolute', marginLeft: '12px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search files..." 
              style={{ paddingLeft: '2.5rem', width: '100%' }} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="input-field" 
            style={{ minWidth: '150px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="CR">CR Books</option>
            <option value="LEASING">Leasing Files</option>
            <option value="LEGAL">Legal Documents</option>
          </select>
          
          <select 
            className="input-field" 
            style={{ minWidth: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="AT_BRANCH">At Branch</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>File Ref</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Title / Description</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Current Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <svg style={{ animation: 'spin 1s linear infinite' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.21-8.58"></path></svg>
                      <span style={{ color: 'var(--text-muted)' }}>Loading documents...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No documents found matching your criteria.
                  </td>
                </tr>
              ) : filteredFiles.map((file, i) => (
                <tr key={file.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>{file.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{file.title}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{file.fileType}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{file.currentDept?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${file.status === 'AT_BRANCH' ? 'badge-info' : file.status === 'IN_TRANSIT' ? 'badge-warning' : 'badge-success'}`}>
                      {file.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      color: file.priority === 'HIGH' ? 'var(--danger-color)' : file.priority === 'MEDIUM' ? 'var(--warning-color)' : 'var(--text-muted)',
                      fontWeight: 600 
                    }}>
                      {file.priority}
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
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Showing {filteredFiles.length} of {files.length} documents
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem' }} disabled>Previous</button>
            <button className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem' }} disabled>Next</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
