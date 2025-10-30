export default function Footer() {
   const currentYear = new Date().getFullYear();

   return (
      <footer className="w-full text-center bg-gray-50 flex items-center justify-center py-10 px-6 md:px-10 mt-10">
         <p className="text-gray-light text-[18px] text-2xl">
            &copy; {currentYear} PTML. All rights reserved.
         </p>
      </footer>
   );
}