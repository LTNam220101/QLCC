"use client";
import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

const ProfileNav = ({
  title,
  backUrl = "/",
  children,
}: {
  title: string;
  backUrl: string;
  children?: React.ReactNode;
}) => {
  const { push } = useRouter();
  const handleBack = () => {
    push(backUrl);
  };
  return (
    <>
      <div
        className={cn("flex items-center h-[60px]", {
          "justify-between": !!children,
        })}
      >
        <div className="flex items-center font-medium text-lg">
          <div
            className="mr-3 flex items-center font-normal text-sm text-[#666] cursor-pointer hover:text-[#3779F4]"
            onClick={handleBack}
          >
            <MoveLeft color="#3779F4" className="mr-2" />
            Quay lại
          </div>
          {title}
        </div>
        {children}
      </div>
      <Separator className="bg-[#D9D9D9]" />
    </>
  );
};

export default ProfileNav;
