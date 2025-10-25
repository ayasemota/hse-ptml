"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
   onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
   const [showConfirm, setShowConfirm] = useState(false);
   const buttonRef = useRef<HTMLButtonElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         const isClickOutside =
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            !buttonRef.current?.contains(event.target as Node);

         if (isClickOutside) {
            setShowConfirm(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleConfirmLogout = () => {
      setShowConfirm(false);
      onLogout();
   };

   return (
      <nav className="relative w-full bg-white border-b border-gray-200 flex justify-between items-center py-4 px-6 md:px-10">
         <Link href="/dashboard" className="w-26">
            <Image src="/logo.png" alt="Logo" width={233} height={73} priority />
         </Link>

         <div className="relative">
            <button
               ref={buttonRef}
               onClick={() => setShowConfirm((prev) => !prev)}
               className="bg-green hover:opacity-80 transition-opacity cursor-pointer text-white py-2.5 px-9 rounded-[10px]"
               aria-expanded={showConfirm}
               aria-haspopup="dialog"
            >
               Log Out
            </button>

            {showConfirm && (
               <div
                  ref={dropdownRef}
                  role="dialog"
                  aria-labelledby="logout-confirm-title"
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50"
               >
                  <p id="logout-confirm-title" className="text-gray-700 text-sm mb-4 text-center">Are you sure you want to log out?</p>
                  <div className="flex justify-center gap-3">
                     <button onClick={() => setShowConfirm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1.5 px-4 rounded-md text-sm transition-colors">No
                     </button>
                     <button onClick={handleConfirmLogout} className="bg-green hover:opacity-80 transition-opacity text-white py-1.5 px-4 rounded-md text-sm">Yes</button>
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
}