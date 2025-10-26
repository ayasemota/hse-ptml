"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';

export default function ReportsPage() {
  useEffect(() => {
    document.title = "HSE-PTML | Report Library";
    loadReports();
  }, []);
  
  let [reports, setReports] = useState<any[]>([]);
  reports = [
    { id: '1', caseNumber: 'HSE-2024-001', dateOfReport: '2024-10-20', incidentLocation: 'Warehouse 3', typeOfFacility: 'Storage Facility', consequences: ['Near-miss', 'Property/Equipment Damage or loss'], summary: 'Minor equipment malfunction detected during routine inspection. Immediate corrective action was taken to prevent escalation.' },
    { id: '2', caseNumber: 'HSE-2024-002', dateOfReport: '2024-10-18', incidentLocation: 'Loading Bay', typeOfFacility: 'Port Terminal', consequences: ['Injury or Illness'], summary: 'Employee slipped on wet surface during cargo loading operation. First aid was administered immediately.' },
    { id: '3', caseNumber: 'HSE-2024-003', dateOfReport: '2024-10-15', incidentLocation: 'Admin Building', typeOfFacility: 'Office', consequences: ['Fire/Explosion'], summary: 'Small electrical fire in server room. Fire suppression system activated successfully, no injuries reported.' }
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const result = await (window as any).storage.list('report_');
      if (result?.keys) {
        const reportsData = await Promise.all(
          result.keys.map(async (key: string) => {
            try {
              const data = await (window as any).storage.get(key);
              return data ? JSON.parse(data.value) : null;
            } catch {
              return null;
            }
          })
        );
        const validReports = reportsData.filter(r => r !== null).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReports(validReports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await (window as any).storage.delete(id);
        loadReports();
      } catch {
        alert('Failed to delete report');
      }
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/dashboard" className="flex items-center text-green-700 hover:text-green-800 mb-6">
          <ChevronLeft className="w-5 h-5" /><span className="ml-1">Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Report Library</h1>

        {loading ? (
          <p className="text-gray-400 text-center">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No reports available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{report.caseNumber}</h3>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="text-sm text-gray-600">{formatDate(report.dateOfReport)}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {[
                        { label: 'Location', value: report.incidentLocation || 'N/A' },
                        { label: 'Facility Type', value: report.typeOfFacility || 'N/A' },
                        { label: 'Consequences', value: report.consequences?.slice(0, 2).join(', ') || 'N/A' }
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                          <p className="text-sm font-medium text-gray-700">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-4 line-clamp-2">{report.summary}</p>
                  </div>
                  <button onClick={() => deleteReport(report.id)} className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Report">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}