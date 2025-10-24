import ActionCard from "./ActionCard";
import Navbar from "./Navbar";

export default function Dashboard() {
   return (
      <>
         <main className="font-poppins">
            <Navbar />
            <section className="container mx-auto px-6">
               <h1 className="text-center mt-16 text-green font-bold text-2xl">{"Health Safety and Environment (HSE) Department"}</h1>
               <div className="mt-10 flex flex-col gap-12">
                  <div className="w-full grid grid-col-1 lg:grid-cols-2 gap-5 justify-self-center">
                     <ActionCard
                        heading="Create Incident Report"
                        text="Click to create a new incident report"
                        bg="#DFECFC"
                        border="#ACCEF5"
                        img={{ src: "stock-up.svg", alt: "Stock up icon" }}
                     />
                     <ActionCard
                        heading="Upload Existing Incident Report"
                        text="Click to upload already existing reports"
                        bg="#90CBB3"
                        border="#62B794"
                        img={{ src: "upload.svg", alt: "Upload icon" }}
                     />
                  </div>
                  <div className="p-8 rounded-[10px] w-full grid gap-10 bg-[#EDEDED]">
                     <h1 className="font-semibold text-[24px]">Report Library</h1>
                     <div className="flex flex-wrap gap-6 justify-between items-center">
                        <p>You have no recorded/uploaded report.</p>
                        <button className="bg-[#AFAFAF] cursor-pointer text-white py-2.5 px-9 rounded-[10px]">View All</button>
                     </div>
                  </div>
               </div>
            </section>
         </main>
      </>
   );
}