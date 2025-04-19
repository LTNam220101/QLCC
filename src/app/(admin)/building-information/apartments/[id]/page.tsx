"use client";

import { ApartmentDetail } from "@/components/apartment/apartment-detail";
import { ApartmentDrawer } from "@/components/apartment/apartment-drawer";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import { Edit } from "lucide-react";
import { use } from "react";

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const apartmentId = Number.parseInt(id, 10);
  const { apartments, openDrawer } = useApartmentStore();
  const apartment = apartments.find((apt) => apt.id === apartmentId);

  const handleEdit = () => {
    openDrawer("edit", apartment);
  };
  return (
    <>
      <PageHeader
        title="Chi tiết căn hộ"
        backUrl="/building-information/apartments"
      >
        <Button className="my-[10px] rounded-md" onClick={handleEdit}>
          <Edit className="mr-2 size-4" />
          Sửa
        </Button>
      </PageHeader>
      <ApartmentDetail apartmentId={apartmentId} />
      <ApartmentDrawer />
    </>
  );
}
