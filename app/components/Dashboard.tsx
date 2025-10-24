import ActionCard from "./ActionCard";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface DashboardProps {
   onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
   return (
      <main className="font-poppins">
         <Navbar onLogout={onLogout} />
         <section className="container mx-auto px-6">
            <h1 className="text-center mt-16 text-green font-bold text-2xl">
               {"Health Safety and Environment (HSE) Department"}
            </h1>
            <div className="w-full mt-20 grid grid-col-1 lg:grid-cols-2 gap-5 flex-wrap justify-self-center">
               <ActionCard
                  heading="Create Incident Report"
                  text="Click to create a new incident report"
                  bg="#DFECFC"
                  border="#ACCEF5"
                  img={{ src: "stock-up.svg", alt: "Create icon" }}
               />
               <ActionCard
                  heading="Upload Existing Incident Report"
                  text="Click to upload already existing reports"
                  bg="#90CBB3"
                  border="#62B794"
                  img={{ src: "stock-up.svg", alt: "Upload icon" }}
               />
            </div>
            <div className="mt-14 p-8 rounded-[10px] w-full grid gap-10 bg-[#EDEDED]">
               <h1 className="font-semibold text-[24px]">Report Library</h1>
               <div className="flex flex-wrap items-center justify-between gap-6">
                  <p className="text-[#B3B3B3]">You have no recorded/uploaded report.</p>
                  <button className="bg-black cursor-pointer text-white py-2.5 px-9 rounded-[10px]">View All</button>
               </div>
            </div>
         </section>
         <Footer />
      </main>
   );
}