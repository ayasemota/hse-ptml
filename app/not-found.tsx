import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "404 - Page Not Found | HSE-PTML",
};

export default function NotFound() {
   return (
      <div className="min-h-screen bg-linear-to-b from-bg to-white flex flex-col items-center justify-center px-6">
         <div className="text-center space-y-8">
            <Image src="/logo.png" alt="PTML Logo" width={233} height={73} className="mx-auto" priority />

            <div className="space-y-4">
               <h1 className="text-[120px] font-bold text-green leading-none">404</h1>
               <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
               <p className="text-gray-600 text-lg max-w-md mx-auto">{"The page you're looking for doesn't exist or has been moved."}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
               <Link href="/dashboard" className="bg-green hover:opacity-90 transition-opacity text-white font-medium py-3 px-8 rounded-lg">Go to Dashboard</Link>
               <Link href="/onboarding" className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 font-medium py-3 px-8 rounded-lg">Log Out</Link>
            </div>
         </div>

         <footer className="absolute bottom-8 text-gray-500 text-sm">&copy; {new Date().getFullYear()} PTML. All rights reserved.</footer>
      </div>
   );
}