"use client";

import { useState, useEffect } from "react";
import { useDashboardAuth } from "../hooks/useAuth";
import ActionCard from "../components/ActionCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { incidentService } from "../services/incidentService";
import { IncidentReport } from "../types/incident";

const ACTION_CARDS = [
   {
      url: "/newform",
      heading: "Create Incident Report",
      text: "Click to create a new incident report",
      color: { bg: "#DFECFC", border: "#ACCEF5" },
      img: { src: "stock-up.svg", alt: "Create icon" },
   },
   {
      url: "/uploadform",
      heading: "Upload Existing Incident Report",
      text: "Click to upload already existing reports",
      color: { bg: "#90CBB3", border: "#62B794" },
      img: { src: "stock-up.svg", alt: "Upload icon" },
   },
];

export default function DashboardPage() {
   const { logout } = useDashboardAuth();
   const [recentReports, setRecentReports] = useState<IncidentReport[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      loadRecentReports();
   }, []);

   const loadRecentReports = async () => {
      try {
         const reports = await incidentService.getAllReports();
         setRecentReports(reports.slice(0, 3));
      } catch (error) {
         console.error("Error loading reports:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <main className="font-poppins">
         <Navbar onLogout={logout} />

         <section className="container mx-auto px-6">
            <h1 className="text-center mt-16 text-green font-bold text-2xl">
               {"Health Safety and Environment (HSE) Department"}
            </h1>

            <div className="w-full mt-20 grid grid-cols-1 lg:grid-cols-2 gap-5">
               {ACTION_CARDS.map((card) => (
                  <Link key={card.heading} href={card.url}>
                     <ActionCard {...card} />
                  </Link>
               ))}
            </div>

            <div className="mt-14 p-8 rounded-[10px] w-full bg-gray">
               <h2 className="font-semibold text-2xl mb-10">Report Library</h2>

               {loading ? (
                  <p className="text-gray-500">Loading reports...</p>
               ) : recentReports.length === 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-6">
                     <p className="text-gray-light">You have no recorded/uploaded report.</p>
                  </div>
               ) : (
                  <>
                     <div className="grid gap-4 mb-6">
                        {recentReports.map((report) => (
                           <div key={report.id} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex flex-wrap gap-4 justify-between items-start">
                                 <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold text-lg">Case #{report.caseNumber}</h3>
                                    <p className="text-sm text-gray-600">Location: {report.incidentLocation}</p>
                                    <p className="text-sm text-gray-500">Date Submitted: {new Date(report.createdAt).toLocaleString()}</p>
                                 </div>
                                 <Link href={`/reports/${report.id}`}>
                                    <button className="text-green hover:underline text-sm cursor-pointer">View Details</button>
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </div>
                     {recentReports.length >= 1 && (
                        <div className="flex justify-end">
                           <Link href="/reports">
                              <button className="bg-black cursor-pointer text-white py-2.5 px-9 rounded-[10px] hover:bg-gray-800 transition-colors">View All</button>
                           </Link>
                        </div>
                     )}
                  </>
               )}
            </div>
         </section>

         <Footer />
      </main>
   );
}