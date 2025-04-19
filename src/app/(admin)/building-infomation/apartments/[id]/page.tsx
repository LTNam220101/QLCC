"use client";

import { ApartmentDetail } from "@/components/apartment/apartment-detail";
import { ApartmentDrawer } from "@/components/apartment/apartment-drawer";
import { use } from "react";

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const apartmentId = Number.parseInt(id, 10);

  return (
    <>
      <ApartmentDetail apartmentId={apartmentId} />
      <ApartmentDrawer />
    </>
  );
}
