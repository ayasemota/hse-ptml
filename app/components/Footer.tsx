export default function Footer() {
   const currentYear = new Date().getFullYear();

   return (
      <footer className="w-full bg-bg flex items-center justify-center py-10 px-6 md:px-10 mt-10">
         <p className="text-[#B3B3B3] font-medium text-2xl">
            &copy; {currentYear} PTML. All rights reserved.
         </p>
      </footer>
   );
}