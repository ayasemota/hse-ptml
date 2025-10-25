import Image from "next/image";

interface ActionCardProps {
   heading: string;
   text: string;
   color: {
      bg: string;
      border: string;
   };
   img: {
      src: string;
      alt: string;
   };
}

export default function ActionCard({ heading, text, color, img }: ActionCardProps) {
   return (
      <div
         className="p-8 rounded-[10px] w-full border border-solid cursor-pointer hover:shadow-lg transition-shadow"
         style={{ backgroundColor: color.bg, borderColor: color.border }}
      >
         <h2 className="font-semibold text-2xl mb-10">{heading}</h2>
         <div className="flex items-center gap-6">
            <Image src={`/${img.src}`} alt={img.alt} width={58} height={58} />
            <p className="max-w-[230px]">{text}</p>
         </div>
      </div>
   );
}