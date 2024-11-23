"use client";

import React, { useEffect } from "react";
import Spinner from "../ui/spinner/spinner";
import axiosInstance from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";

export default function Acceptinvitation() {
  const router = useRouter();
  const { workSpaceId }: { workSpaceId: string } = useParams();

  useEffect(() => {
    if (workSpaceId) {
      const fetchData = async () => {
        try {
          const res = await axiosInstance.patch(
            `/workspace/${workSpaceId}/accept-invitation`
          );

          if (res.status === 200) {
            router.push(`/w/${workSpaceId}/dashboard`);
          }
        } catch (err) {
          console.error(err);
          // router.push(`/w/${workspaceId}/dashboard`);
        }
      };
      fetchData();
    }
  }, [workSpaceId]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
}
