import { getSettings } from "@/app/shared/helpers";
import Image from "next/image";
import Link from "next/link";

export const Header = async () => {
  const settings = await getSettings();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2 flex justify-center items-center">
        <Link href="/">
          <Image
            src={settings.logoUrl}
            width={300}
            height={40}
            alt="image"
            className="w-60 h-10"
          />
        </Link>
      </div>
    </div>
  );
};
