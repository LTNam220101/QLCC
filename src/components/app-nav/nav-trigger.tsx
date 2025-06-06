"use client";

import React from "react";

import { SidebarTrigger } from "../ui/sidebar";
import Search from "@/icons/search-normal.svg";
import { Input } from "../ui/input";
import NavAvatar from "./nav-avatar";
const NavTrigger = () => {

  return (
    <div className="flex items-center flex-1 justify-between ml-8 mr-[35px]">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center w-[463px] h-[44px] rounded-xl border border-[#C9CDD1] px-[10px]">
          <Search />
          <Input className="h-[44px] border-none shadow-none focus-visible:ring-0" placeholder="Tìm kiếm..." />
        </div>
      </div>
      <NavAvatar />
    </div>
  );
};

export default NavTrigger;
