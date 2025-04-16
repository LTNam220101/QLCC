"use client";

import React from "react";

import { SidebarTrigger } from "../ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

const NavTrigger = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-5">
        <SidebarTrigger />
        <Search className="size-7" color="#666"/>
        <Input className="w-[228px] h-[56px] rounded" placeholder="Tìm kiếm"/>
      </div>
    </div>
  );
};

export default NavTrigger;
