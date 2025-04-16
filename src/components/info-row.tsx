import React from "react";

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}
const InfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <div className="flex items-center text-sm border border-[#D9D9D9] border-t-0 first:border-t first:rounded-t overflow-auto">
      <div className="w-1/2 max-w-[300px] bg-[#F5F5F5] p-3 border-0 border-[#D9D9D9] border-r">
        {label}
      </div>
      <div className="flex-1 p-3">{value}</div>
    </div>
  );
};

export default InfoRow;
