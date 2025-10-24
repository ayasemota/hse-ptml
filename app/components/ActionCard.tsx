import Image from "next/image";

interface Props {
   heading: string;
   text: string;
   bg: string;
   border: string;
   img: {
      src: string;
      alt: string;
   };
}

export default function ActionCard(props: Props) {
   return (
      <div
         className="p-8 rounded-[10px] w-full grid gap-10 border border-solid"
         style={{ backgroundColor: props.bg, borderColor: props.border }}
      >
         <h1 className="font-semibold text-[24px]">{props.heading}</h1>
         <div className="flex items-center gap-6">
            <Image src={`/${props.img.src}`} alt={props.img.alt} width={58} height={58} />
            <p className="max-w-[230px]">{props.text}</p>
         </div>
      </div>
   );
}