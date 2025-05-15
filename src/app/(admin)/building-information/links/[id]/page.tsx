"use client";

import { UserApartmentDetail } from "@/components/user-apartment/user-apartment-detail";
import { UserApartmentDrawer } from "@/components/user-apartment/user-apartment-drawer";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useUserApartmentStore } from "@/lib/store/use-user-apartment-store";
import { useUserApartment } from "@/lib/tanstack-query/user-apartments/queries";
import { Edit } from "lucide-react";
import { use } from "react";

export default function UserApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data } = useUserApartment(id);

  const { openDrawer } = useUserApartmentStore();

  const handleEdit = () => {
    if (data?.data) {
      openDrawer("edit", data?.data);
    }
  };
  return (
    <>
      <PageHeader
        title="Chi tiết căn hộ"
        backUrl="/building-information/links"
      >
        <Button className="my-[10px] rounded-md" onClick={handleEdit}>
          <Edit className="mr-2 size-4" />
          Sửa
        </Button>
      </PageHeader>
      <UserApartmentDetail userApartmentId={id} />
      <UserApartmentDrawer />
    </>
  );
}
