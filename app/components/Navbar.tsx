import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
   return (
      <nav className="w-full bg-white border-b border-gray-200 flex justify-between items-center py-4 px-6 md:px-10">
         <Link href="/" className="w-26">
            <Image src="/logo.png" alt="Logo" width={233} height={73}/>
         </Link>
         <Link href="/">
            <button className="bg-orange cursor-pointer text-white py-2.5 px-9 rounded-[10px]">Logout</button>
         </Link>
      </nav>
   );
}