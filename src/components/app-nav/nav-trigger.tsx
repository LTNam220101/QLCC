"use client";

import React from "react";

import { SidebarTrigger } from "../ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import NavAvatar from "./nav-avatar";

const NavTrigger = () => {
  return (
    <div className="flex items-center flex-1 justify-between ml-[15px] mr-[35px]">
      <div className="flex items-center gap-5">
        <SidebarTrigger />
        <Search className="size-7" color="#666" />
        <Input className="w-[228px] h-[56px] rounded" placeholder="Tìm kiếm" />
      </div>
      <NavAvatar />
    </div>
  );
};

export default NavTrigger;
