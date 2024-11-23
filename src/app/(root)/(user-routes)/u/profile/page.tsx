"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Usercards } from "@/components/user-profile/user-cards";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearMessages,
  fetchUserProfile,
} from "@/lib/store/features/userSlice";
import ProfileSettings from "@/components/user-settings/userSettings";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"activity" | "cards">("activity");
  const dispatch = useAppDispatch();
  const { userProfile, successMessage, error } = useAppSelector(
    (state) => state.user
  );
  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userProfile]);

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
      });
      dispatch(clearMessages());
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
      });
      dispatch(clearMessages());
    }
  }, [successMessage, error, toast, dispatch]);

  const handleTabClick = (tab: "activity" | "cards") => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#EDF1F4] dark:bg-darkBg">
      <div className="flex flex-col md:flex-row md:justify-around items-center p-4 rounded-lg mb-8 space-y-4 md:space-y-0">
        <div className="flex flex-col items-center space-y-3 md:space-y-0 md:items-start">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={
                userProfile?.image ||
                "https://i.pinimg.com/564x/a3/e4/7c/a3e47c7483116543b6fa589269b760df.jpg"
              }
              alt="User Profile"
            />
            <AvatarFallback />
          </Avatar>
          <div className="mt-3 text-center md:text-left">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
              {userProfile?.firstName} {userProfile?.lastName}
            </h1>
            <h3 className="text-sm text-gray-600 dark:text-gray-200">
              {userProfile?.email}
            </h3>
          </div>
        </div>
        <div className="bg-lime-300 p-1 rounded-lg dark:text-black">
          <h1 className="text-sm">Online</h1>
        </div>
      </div>

      <div className="flex flex-col px-4 md:px-20">
        <div className="flex mb-3 gap-8 justify-center md:justify-start border-b-2 border-gray-300">
          <h2
            onClick={() => handleTabClick("activity")}
            className={`text-lg font-semibold cursor-pointer ${
              activeTab === "activity"
                ? "text-black border-b-2 dark:text-gray-100 border-gray-100"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Settings
          </h2>
          <h2
            onClick={() => handleTabClick("cards")}
            className={`text-lg font-semibold cursor-pointer ${
              activeTab === "cards"
                ? "text-black border-b-2 dark:text-gray-100 border-gray-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Cards
          </h2>
        </div>

        {activeTab === "activity" ? <ProfileSettings /> : <Usercards />}
      </div>
    </div>
  );
}
