"use client";
import InviteButton from "./invitebutton";
import ProfileSection from "./profilesection";
import SearchField from "./searchfield";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../ui/dark-mode/mode-toggle";
import { usePathname } from "next/navigation";
import SubscriptionBtn from "./subscription-btn";

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="bg-white dark:bg-darkBg shadow-md z-50 sm:z-40">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/">
          <div className="flex items-center space-x-4 sm:ml-10">
            <Image
              src="/images/DOQ_LOGO.png"
              alt="Logo"
              className={`h-8 w-10 sm:w-12 md:w-14 ${
                path == "/u/home" ? "ml-10" : ""
              } `}
              width={300}
              height={300}
            />
          </div>
        </Link>
        <div className="relative w-5/12 mx-4">
          <SearchField />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-6">
          <SubscriptionBtn />
          <InviteButton />
          <ModeToggle />
          <ProfileSection />
        </div>
      </div>
    </nav>
  );
}
