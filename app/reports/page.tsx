"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { incidentService } from "../services/incidentService";
import { IncidentReport } from "../types/incident";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDashboardAuth } from "../hooks/useAuth";

export default function ReportsPage() {
  const router = useRouter();
  const { logout } = useDashboardAuth();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "HSE-PTML | Report Library";
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await incidentService.getAllReports();
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await incidentService.deleteReport(id);
      setReports(reports.filter((report) => report.id !== id));
      alert("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report");
    }
  };

  return (
    <main className="font-poppins min-h-screen">
      <Navbar onLogout={logout} />

      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green">Report Library</h1>
          <button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white py-2.5 px-8 rounded-lg transition-colors cursor-pointer">Back to Dashboard</button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No reports found</p>
            <button onClick={() => router.push("/newform")} className="mt-6 bg-green hover:opacity-90 text-white py-2.5 px-8 rounded-lg transition-opacity cursor-pointer">Create First Report</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-green mb-2">Case #{report.caseNumber}</h2>
                    <p className="text-gray-600">Incident Date: {new Date(report.dateOfIncident).toLocaleDateString()}</p>
                    <p className="text-gray-600">Location: {report.incidentLocation}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => router.push(`/reports/${report.id}`)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer">View</button>
                    <button onClick={() => handleDelete(report.id!)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer">Delete</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Report Date</p>
                    <p className="font-medium">{new Date(report.dateOfReport).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Facility Type</p>
                    <p className="font-medium">{report.typeOfFacility}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Team Leader</p>
                    <p className="font-medium">{report.teamLeader}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Consequences</p>
                    <p className="font-medium">{report.incidentConsequences.join(", ")}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Summary</p>
                  <p className="text-gray-700 line-clamp-2">{report.summaryOfIncident}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}