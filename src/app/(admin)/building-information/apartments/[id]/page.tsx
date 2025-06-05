"use client";

import { ApartmentDetail } from "@/components/apartment/apartment-detail";
import { ApartmentDrawer } from "@/components/apartment/apartment-drawer";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import { useApartment } from "@/lib/tanstack-query/apartments/queries";
import Edit from "@/icons/edit.svg";;
import { use } from "react";

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data } = useApartment(id);

  const { openDrawer } = useApartmentStore();

  const handleEdit = () => {
    if (data?.data) {
      openDrawer("edit", data?.data);
    }
  };
  return (
    <>
      <PageHeader
        title="Chi tiết căn hộ"
        backUrl="/building-information/apartments"
      >
        <Button className="my-[10px] rounded-md" onClick={handleEdit}>
          <Edit className="mr-2 size-5" />
          Sửa
        </Button>
      </PageHeader>
      <ApartmentDetail apartmentId={id} />
      <ApartmentDrawer />
    </>
  );
}
