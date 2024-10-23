"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { axiosErrorCatch } from "@/utils/axiosErrorCatch";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllUsers } from "@/lib/store/features/workspace-slice";
import axiosInstance from "@/utils/axios";

type UserEmail = {
  email: string;
};

export default function InviteButton() {
  const dispatch = useAppDispatch()
  const {loggedUser}= useAppSelector((state)=>state.user)
  const { workSpaceId, allUsers } = useSelector((state: RootState)=> state.workspace);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [suggestions, setSuggestions] = useState<UserEmail[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (value.length > 2) {
      try {
        const filteredSuggestions = allUsers.filter((user: UserEmail) =>
          user.email.toLowerCase().includes(value.toLowerCase())
        );
        dispatch(fetchAllUsers())
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
        setShowSuggestions(true);
      } catch (error) {
        console.log("Error fetching suggestions", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (email: string) => {
    setFormData({ email });
    setShowSuggestions(false);
  };

  const {toast} = useToast()

  const handleSend = async () => {
    setIsOpen(false)
    try {
      const resp = await axiosInstance.post(
        `/workspace/${workSpaceId}/invite`,
        { email: formData.email }
      );
  
      if (resp.status == 200) {
        toast({
          title: "Sent",
          description: "Invitation Send Successfully",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: axiosErrorCatch(error),
      });
    }
  };

  if (!workSpaceId) return null;
  else {
    return (
      <div>
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="bg-white rounded-3xl hover:bg-transparent dark:bg-black"
            >
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Invite a Member</DialogTitle>
              <DialogDescription>Add the member email</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 relative">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    name="email"
                    id="email"
                    className="w-full"
                    autoComplete="off"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-auto">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleSelectSuggestion(suggestion?.email)
                          }
                        >
                          {suggestion?.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSend} type="submit">
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
