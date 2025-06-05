import { cn } from "@/lib/utils";
import React from "react";

interface InfoRowProps {
  label: string;
  value?: string | number | React.ReactNode;
  highlight?: boolean;
  className?: string;
}
const InfoRow = ({ label, value, className }: InfoRowProps) => {
  return (
    <div
      className={cn(
        "group flex items-center text-[16px] text-[#79828B] font-medium border-[0.5px] border-[#D9D9D9] border-t-0 first:border-t-[0.5px] first:rounded-t-lg last:border-b-[0.5px] last:rounded-b-lg overflow-auto",
        className
      )}
    >
      <div className="w-1/2 max-w-[300px] py-3 px-7 group-first:pt-5 group-last:pb-5">
        {label}
      </div>
      <div className="text-[16px] text-[#303438] font-bold flex-1 p-3">{value ?? "---"}</div>
    </div>
  );
};

export default InfoRow;
