"use client";

import { useRouter } from "next/navigation";

interface SuccessModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
   const router = useRouter();

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
               <div className="mx-auto w-16 h-16 bg-green rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
               </div>
               <h2 className="text-2xl font-bold text-green mb-2">Success!</h2>
               <p className="text-gray-600">Your incident report has been submitted successfully.</p>
            </div>

            <div className="grid gap-3">
               <button onClick={() => { onClose(); window.location.reload(); }} className="w-full bg-green hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-opacity cursor-pointer">Fill New Form</button>
               <button onClick={() => router.push("/reports")} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer">View Reports</button>
               <button onClick={() => router.push("/dashboard")} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer">Go to Dashboard</button>
            </div>
         </div>
      </div>
   );
}