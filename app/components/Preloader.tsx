"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PRELOADER_DURATION = 6000;

export default function Preloader() {
   const [isVisible, setIsVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsVisible(false);
      }, PRELOADER_DURATION);

      return () => clearTimeout(timer);
   }, []);

   if (!isVisible) return null;

   return (
      <div
         className={`fixed inset-0 z-9999 flex items-center justify-center bg-bg transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
      >
         <div className="relative flex flex-col items-center gap-6">
            <div className="relative">
               <div className="absolute inset-5 rounded-full animate-spin-slow" />
               <Image src="/logo.png" alt="Logo" width={233} height={73} priority />
            </div>

            <div className="flex gap-2">
               {[0, 1, 2].map((index) => (
                  <span
                     key={index}
                     className="w-2 h-2 bg-green rounded-full animate-pulse"
                     style={{ animationDelay: `${-0.3 + index * 0.15}s` }}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}