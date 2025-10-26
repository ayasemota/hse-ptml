"use client";

import { Upload, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import { useEffect } from 'react';

export default function UploadFormPage() {
   useEffect(() => {
      document.title = "HSE-PTML | Upload Report";
   }, []);

   return (
      <div className="min-h-screen bg-gray-50 font-poppins">
         <Header />
         <div className="max-w-3xl mx-auto px-6 py-12 text-center">
            <Link href="/" className="flex items-center text-green-700 hover:text-green-800 mb-8">
               <ChevronLeft className="w-5 h-5" /><span className="ml-1">Back to Dashboard</span>
            </Link>
            <Upload className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Existing Reports</h2>
            <p className="text-gray-600 mb-8">This feature is coming soon. You can create new reports using the form.</p>
            <Link href="/newform">
               <button className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700">Create New Report Instead</button>
            </Link>
         </div>
      </div>
   );
}