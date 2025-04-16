import ProfileNav from "@/components/profile/profile-nav";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React from "react";

const ChangeProfile = () => {
  return (
    <div>
      <ProfileNav title="Sửa thông tin tài khoản" backUrl="/profile/profile-info">
        <Button className="flex items-center my-[10px]">
          <Pencil />
          Lưu
        </Button>
      </ProfileNav>
      <div className="space-y-8 mt-5 my-20"></div>
    </div>
  );
};

export default ChangeProfile;
