import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
   title: "HSE-PTML | Create Incident Report Form",
};

const INCIDENT_CONSEQUENCES = ["Near-miss", "Fire/Explosion", "Injury or Illness", "Motor Vehicle", "Fatality", "Environmental Impact", "Non-Conformity", "Property/Equipment Damage or Loss", "Spill/Release", "Others"];

function Navbar() {
   return (
      <>
         <nav className="relative w-full flex flex-col justify-between items-center py-4 px-6 md:px-10">
            <div className="flex flex-wrap md:nowrap gap-4 w-full items-center justify-between">
               <Link href="/dashboard">
                  <Image src="/logo.png" alt="Logo" height={84} width={266} priority />
               </Link>
               <div className="text-[#818181] text-[20px]">
                  <p>PTML Terminal</p>
                  <p>Tin Can Island Ports Complex, Apapa, Lagos.</p>
                  <p>Email: info@ptml-ng.com</p>
                  <p>Tel: +234 1 2790890-1</p>
                  <p>Fax: +234 1 2790892</p>
               </div>
            </div>
            <div className="h-0.5 w-full bg-[#818181] m-10"></div>
         </nav>
      </>
   )
}
export default function NewForm() {
   return (
      <>
         <Navbar />
         <section className="container mx-auto px-12">
            <h1 className="text-[40px] font-bold text-green">INCIDENT REPORT FORM</h1>

            <div className="pt-12 grid gap-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="border border-green rounded-lg p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                     <h2 className="text-green font-bold text-xl text-center">Date of Incident</h2>
                     <input type="date" className="w-48 h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green" />
                  </div>

                  <div className="border border-green rounded-lg p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                     <h2 className="text-green font-bold text-xl text-center">Date of Report</h2>
                     <input type="date" className="w-48 h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green" />
                  </div>

                  <div className="border border-green rounded-lg p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                     <h2 className="text-green font-bold text-xl text-center">Case Number</h2>
                     <input type="number" placeholder="Enter Case Number" className="w-48 h-12 px-4 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green" />
                  </div>
               </div>

               <div className="grid gap-4">
                  <h2 className="text-green text-2xl font-semibold">INCIDENT CONSEQUENCES <span className="font-light">{"(Kindly check all that apply)"}</span></h2>

                  <form>
                     <div className="flex flex-wrap gap-4 mt-4">
                        {INCIDENT_CONSEQUENCES.map((label) => (
                           <label key={label} className="flex items-center gap-4 cursor-pointer text-black mr-8">
                              <input type="checkbox" name="consequence" value={label} className="appearance-none w-5 h-5 rounded-md border border-green shadow-sm shadow-green checked:bg-green checked:shadow-sm checked:shadow-green focus:outline-none focus:ring-2 focus:ring-none transition-all duration-200" />
                              {label}
                           </label>
                        ))}
                     </div>
                  </form>
               </div>
            </div>
         </section>
      </>
   );
}