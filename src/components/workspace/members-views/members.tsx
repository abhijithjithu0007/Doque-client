"use client";

import React, { useEffect, useState } from "react";
import MembersGrid from "@/components/workspace/members-views/member-grid";
import MembersList from "@/components/workspace/members-views/member-list";
import { IoGrid, IoList } from "react-icons/io5";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  fetchInvitedMembers,
} from "@/lib/store/features/workspace-slice";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export default function Members() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"members" | "teams">("members");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortType, setSortType] = useState<"name" | "">("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleTabSwitch = (tab: "members" | "teams") => setActiveTab(tab);
  const handleViewSwitch = (view: "grid" | "list") => setViewType(view);

  const {invitedMembers} = useAppSelector(state=> state.workspace)

  const { workSpaceId }: { workSpaceId: string } = useParams();

  const filteredUsers = invitedMembers
    ?.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }
      return 0;
    });

  const renderContent = () => {
    if (activeTab === "members") {
      return viewType === "grid" ? (
        <MembersGrid members={filteredUsers} />
      ) : (
        <MembersList members={filteredUsers} />
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchInvitedMembers({ workSpaceId }));
    };
    fetchData();
  }, [workSpaceId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await dispatch(fetchUserProfiles({ members }));
  //   };
  //   fetchData();
  // }, [members]);

  return (
    <div className="relative">
      <div className="mb-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex mt-2">
            <h2
              className={`text-base font-medium sm:font-semibold md:font-medium lg:font-medium cursor-pointer ${
                activeTab === "members"
                  ? "sm:border-b-2 border-gray-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => handleTabSwitch("members")}
            >
              Members
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-end mt-4 sm:mt-0 gap-2">
            <div className="relative flex items-center text-sm">
              <FiSearch
                size={16}
                className="absolute left-3 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                className="pl-10 w-44 sm:w-72 bg-transparent pr-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <FiFilter
              className="w-5 h-5 text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-20 w-40 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSortType("name");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Name
                  </li>
                </ul>
              </div>
            )}

            <div className="flex items-center">
              <div
                className={`p-2 rounded cursor-pointer ${
                  viewType === "grid"
                    ? "bg-gray-600 dark:bg-gray-200"
                    : "bg-transparent"
                }`}
                onClick={() => handleViewSwitch("grid")}
                title="Grid View"
              >
                <IoGrid
                  className={`text-gray-600 dark:text-gray-300 text-sm ${
                    viewType === "grid" ? "text-white dark:text-gray-600" : ""
                  }`}
                />
              </div>
              <div
                className={`p-2 rounded cursor-pointer ${
                  viewType === "list"
                    ? "bg-gray-600 dark:bg-gray-200"
                    : "bg-transparent"
                }`}
                onClick={() => handleViewSwitch("list")}
                title="List View"
              >
                <IoList
                  className={`text-gray-600 dark:text-gray-300 text-sm ${
                    viewType === "list" ? "text-white dark:text-gray-600" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-2 bg-gray-900 dark:bg-gray-600"/>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
