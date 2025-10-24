"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
   onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
   const [showConfirm, setShowConfirm] = useState(false);
   const buttonRef = useRef<HTMLButtonElement | null>(null);
   const dropdownRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            !buttonRef.current?.contains(event.target as Node)
         ) {
            setShowConfirm(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <nav className="relative w-full bg-white border-b border-gray-200 flex justify-between items-center py-4 px-6 md:px-10">
         <Link href="/" className="w-26">
            <Image src="/logo.png" alt="Logo" width={233} height={73} />
         </Link>

         <div className="relative">
            <button
               ref={buttonRef}
               onClick={() => setShowConfirm((prev) => !prev)}
               className="bg-green hover:opacity-80 transition-all cursor-pointer text-white py-2.5 px-9 rounded-[10px]"
            >
               Log Out
            </button>

            {showConfirm && (
               <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50"
               >
                  <p className="text-gray-700 text-sm mb-4 text-center">
                     Are you sure you want to log out?
                  </p>
                  <div className="flex justify-center gap-3">
                     <button
                        onClick={() => setShowConfirm(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1.5 px-4 rounded-md text-sm"
                     >
                        No
                     </button>
                     <button
                        onClick={() => {
                           setShowConfirm(false);
                           onLogout();
                        }}
                        className="bg-green hover:opacity-80 transition-all text-white py-1.5 px-4 rounded-md text-sm"
                     >
                        Yes
                     </button>
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
}