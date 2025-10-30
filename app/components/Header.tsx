import Image from "next/image";

export default function Header() {
   return (
      <>
         <header className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
               <div className="flex justify-center items-center space-x-3">
                  <Image src="/logo.png" alt="Logo" width={233} height={73} priority />
               </div>
               <div className="text-center md:text-right text-xs text-gray-600">
                  <p>PTML Terminal</p>
                  <p>Tin Can Island Ports Complex, Apapa, Lagos</p>
                  <p>Tin Can Island, Apapa, Lagos</p>
                  <p>Email: info@ptml-ng.com</p>
               </div>
            </div>
         </header>
      </>
   );
}