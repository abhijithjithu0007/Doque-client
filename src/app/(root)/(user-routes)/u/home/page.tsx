import MyWorkSpace from "@/components/user-home/my-workspace";
import GuestWorkSpaces from "@/components/user-home/guest-workspace";
import TemplateCarousel from "@/components/user-home/template-carousel";

export default function Workspace() {
  return (
    <div className="w-full p-4 flex-grow overflow-auto hide-scrollbar bg-pattern dark:bg-pattern-dark dark:bg-dark">
      <h1 className="text-1xl sm:text-2xl md:text-2xl text-[#3B3C3D] font-bold ml-5 mb-4 dark:text-white">
        My Workspaces
      </h1>
      <hr />

      <MyWorkSpace />

      <GuestWorkSpaces />

      <h1 className="text-1xl sm:text-2xl md:text-2xl text-[#3B3C3D] font-bold ml-5 mb-4 dark:text-white">
        Templates
      </h1>
      <hr />
      <TemplateCarousel />
    </div>
  );
}
