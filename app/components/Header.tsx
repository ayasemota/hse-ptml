export default function Header() {
   return (
      <>
         <header className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
               <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
                  <div>
                     <h1 className="text-xl font-bold text-green-700">HSE | PTML</h1>
                     <p className="text-xs text-gray-500">Parts & Terminal Multiservices Ltd.</p>
                  </div>
               </div>
               <div className="text-left md:text-right text-xs text-gray-600">
                  <p>PTML Terminal</p>
                  <p className="hidden sm:block">Tin Can Island Ports Complex, Apapa, Lagos</p>
                  <p className="sm:hidden">Tin Can Island, Apapa, Lagos</p>
                  <p>Email: info@ptml-ng.com</p>
               </div>
            </div>
         </header>
      </>
   );
}