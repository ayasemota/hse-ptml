"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
   const [isVisible, setIsVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsVisible(false);
      }, 6000);
      return () => clearTimeout(timer);
   }, []);

   return (
      <div
         className={`fixed inset-0 z-9999 flex items-center justify-center bg-bg transition-opacity duration-3000ms ${isVisible
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
            }`}
      >
         <div className="relative flex flex-col items-center gap-6">
            <div className="relative">
               <div className="absolute inset-5 rounded-full animate-spin-slow" />
               <Image src="/logo.png" alt="Logo" width={233} height={73} />
            </div>
            <div className="flex gap-2">
               <span className="w-2 h-2 bg-green rounded-full animate-pulse [animation-delay:-0.3s]" />
               <span className="w-2 h-2 bg-green rounded-full animate-pulse [animation-delay:-0.15s]" />
               <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            </div>
         </div>
      </div>
   );
}