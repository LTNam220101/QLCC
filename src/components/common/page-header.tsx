"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Arrow from "@/icons/arrow-up.svg";
import { useRouter } from "next/navigation";

const PageHeader = ({
  title,
  backUrl,
  children,
}: {
  title: string | React.ReactNode;
  backUrl?: string;
  children?: React.ReactNode;
}) => {
  const { push } = useRouter();
  const handleBack = () => {
    push(backUrl!);
  };
  return (
    <>
      <div
        className={cn("flex items-center h-[56px] px-7 bg-white rounded-t-lg", {
          "justify-between": !!children,
          'h-[60px] pl-4': !!backUrl
        })}
      >
        <div className="flex items-center font-bold text-lg text-[#303438]">
          {!!backUrl && (
            <div
              className="mr-9 flex items-center font-medium text-green cursor-pointer"
              onClick={handleBack}
            >
              <Arrow className="mr-2 [&_path]:stroke-green -rotate-90" />
              Quay lại
            </div>
          )}
          {title}
        </div>
        {children}
      </div>
    </>
  );
};

export default PageHeader;
