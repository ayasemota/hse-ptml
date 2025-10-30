"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { incidentService } from "../../services/incidentService";
import { IncidentReport } from "../../types/incident";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useDashboardAuth } from "../../hooks/useAuth";
import { ChevronLeft, Printer } from "lucide-react";
import Link from "next/link";

export default function ReportDetailPage() {
   const params = useParams();
   const router = useRouter();
   const { logout } = useDashboardAuth();
   const [report, setReport] = useState<IncidentReport | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      loadReport();
   }, [params.id]);

   const loadReport = async () => {
      try {
         const id = params.id as string;
         const data = await incidentService.getReportById(id);
         if (data) {
            setReport(data);
            document.title = `HSE-PTML | Report ${data.caseNumber}`;
         } else {
            router.push("/404");
         }
      } catch (error) {
         console.error("Error loading report:", error);
         router.push("/404");
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this report?")) return;

      try {
         await incidentService.deleteReport(id);
         router.push("/reports");
         alert("Report deleted successfully");
      } catch (error) {
         console.error("Error deleting report:", error);
         alert("Failed to delete report");
      }
   };

   if (loading) {
      return (
         <main className="font-poppins min-h-screen">
            <Navbar onLogout={logout} />
            <section className="container mx-auto px-6 py-12">
               <p className="text-center text-2xl text-gray-500">Loading report...</p>
            </section>
            <Footer />
         </main>
      );
   }

   if (!report) {
      return null;
   }

   return (
      <main className="font-poppins min-h-screen print:bg-white">
         <div className="print:hidden">
            <Navbar onLogout={logout} />
         </div>

         <section className="container mx-auto px-6 py-12">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 print:hidden">
               <Link href="/reports" className="flex items-center text-green-700 hover:text-green-800">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="ml-1">Back to Reports</span>
               </Link>
               <div className="flex flex-wrap gap-4">
                  <button onClick={() => window.print()} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer">
                     <Printer className="w-5 h-5 mr-2" />Print Report
                  </button>
                  <button onClick={() => handleDelete(report.id!)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer">Delete</button>               </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
               <h1 className="text-3xl font-bold text-green mb-8">INCIDENT REPORT FORM</h1>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">Date of Incident:</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{new Date(report.dateOfIncident).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">Date of Report:</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{new Date(report.dateOfReport).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">Case Number:</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.caseNumber}</p>
                  </div>
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-3">INCIDENT CONSEQUENCES</label>
                  <div className="flex flex-wrap gap-2">
                     {report.incidentConsequences.map((consequence) => (
                        <span key={consequence} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{consequence}</span>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">INCIDENT LOCATION</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.incidentLocation}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">TYPE OF FACILITY</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.typeOfFacility}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">TYPE OF EQUIPMENT</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.typeOfEquipment}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">{"INCIDENT COST (USD) - Direct"}</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">${report.incidentCostDirect}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">Lost Profit</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">${report.incidentCostLostProfit}</p>
                  </div>
               </div>

               <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                     <div>
                        <label className="block text-sm font-semibold text-green-700 mb-2">TEAM LEADER</label>
                        <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.teamLeader}</p>
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-green-700 mb-2">P.I.C JOB TITLE</label>
                        <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.plcJobTitle}</p>
                     </div>
                  </div>
                  {report.teamMembers && (
                     <div>
                        <label className="block text-sm font-semibold text-green-700 mb-2">TEAM MEMBERS</label>
                        <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.teamMembers}</p>
                     </div>
                  )}
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-2">SUMMARY OF INCIDENT</label>
                  <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 whitespace-pre-wrap print:border-0">{report.summaryOfIncident}</p>
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-2">PRIMARY CAUSE(S) OF INCIDENT</label>
                  <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 whitespace-pre-wrap print:border-0">{report.primaryCause}</p>
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-2">RECOMMENDATIONS</label>
                  <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 whitespace-pre-wrap print:border-0">{report.recommendations}</p>
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-3">ACTION ITEMS</label>
                  <div className="overflow-x-auto">
                     <table className="w-full border-collapse">
                        <thead>
                           <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Ownership Assigned To</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                           </tr>
                        </thead>
                        <tbody>
                           {report.actionItems.map((item, index) => (
                              <tr key={index}>
                                 <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                 <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                                 <td className="border border-gray-300 px-4 py-2">{item.ownership}</td>
                                 <td className="border border-gray-300 px-4 py-2">{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">DATE APPROVED</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.dateApproved ? new Date(report.dateApproved).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">PERSON IN CHARGE</label>
                     <p className="h-10 border border-gray-300 rounded-lg px-4 py-2 print:border-0">{report.personInCharge}</p>
                  </div>
               </div>

               <div className="text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                  <p>Report created: {new Date(report.createdAt).toLocaleString()}</p>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}