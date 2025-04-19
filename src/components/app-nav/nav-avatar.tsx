import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import Link from "next/link";

const NavAvatar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-[52px]">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={22} className="w-[216px]">
        <DropdownMenuItem className="text-md p-2 cursor-pointer">
          <Link href="/profile/profile-info" className="flex items-center">
            <UserRound color="black" className="size-4 mr-3" />
            Thông tin tài khoản
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-md p-2 cursor-pointer">
          <Link href="/profile/change-password" className="flex items-center">
            <KeyRound color="black" className="size-4 mr-3" />
            Đổi mật khẩu
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red text-md p-2 hover:text-red focus:text-red cursor-pointer">
          <Link href="/login" className="flex items-center">
            <LogOut color="red" className="size-4 mr-3" />
            Đăng xuất
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavAvatar;
