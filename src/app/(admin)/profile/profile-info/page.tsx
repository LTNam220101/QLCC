"use client";
import InfoRow from "@/components/common/info-row";
import PageHeader from "@/components/common/page-header";
import DeleteAccountModal from "@/components/profile/delete-account-modal";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/tanstack-query/profiles/queries";
import { KeyRound, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ProfileInfo = () => {
  const { push } = useRouter();
  const {data} = useProfile()
  const changeProfile = () => {
    push("/profile/profile-info/change-profile");
  };
  const changePassword = () => {
    push("/profile/change-password");
  };
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Thông tin tài khoản" backUrl="/">
        <Button className="flex items-center my-[10px]" onClick={changeProfile}>
          <Pencil />
          Sửa
        </Button>
      </PageHeader>
      <div className="space-y-8 mt-5 my-20">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Thông tin chung</h2>
          <div className="grid md:grid-cols-2 gap-x-10">
            <div>
              <InfoRow label="Số điện thoại" value={data?.data?.phone} />
              <InfoRow label="Họ và tên" value={data?.data?.username} highlight />
              <InfoRow label="Số CMND/CCCD/Hộ chiếu" />
              <InfoRow label="Nơi cấp CMND/CCCD/Hộ chiếu" />
            </div>
            <div>
              <InfoRow label="Email" />
              <InfoRow label="Ngày sinh" />
              <InfoRow label="Ngày cấp CMND/CCCD/Hộ chiếu" />
              <InfoRow label="Giới tính" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Thông tin khác</h2>
          <div className="grid md:grid-cols-2 gap-x-10">
            <div>
              <InfoRow label="Người tạo" value="Admin" />
              <InfoRow label="Người cập nhật" value="Admin" />
            </div>
            <div>
              <InfoRow label="Ngày tạo" value="01/01/2023" />
              <InfoRow label="Ngày cập nhật" value="01/06/2023" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[136px] gap-[30px] mt-[30px]">
          <DeleteAccountModal />
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 font-medium"
            onClick={changePassword}
          >
            <KeyRound />
            Đổi mật khẩu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
