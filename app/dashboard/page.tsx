"use client";

import { useEffect } from "react";
import { useDashboardAuth } from "../hooks/useAuth";
import ActionCard from "../components/ActionCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Link from "next/link";

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

   useEffect(() => {
      document.title = "HSE-PTML | Dashboard";
   }, []);

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

            <div className="mt-14 p-8 rounded-[10px] w-full bg-[#EDEDED]">
               <h2 className="font-semibold text-2xl mb-10">Report Library</h2>

               <div className="flex flex-wrap items-center justify-between gap-6">
                  <p className="text-[#B3B3B3]">
                     You have no recorded/uploaded report.
                  </p>
                  <Link href="/reports">
                     <button className="bg-black cursor-pointer text-white py-2.5 px-9 rounded-[10px] hover:bg-gray-800 transition-colors">
                        View All
                     </button>
                  </Link>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}