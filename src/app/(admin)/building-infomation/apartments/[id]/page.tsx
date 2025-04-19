"use client"

import { ApartmentDetail } from "@/components/apartment/apartment-detail"
import { ApartmentDrawer } from "@/components/apartment/apartment-drawer"
import PageHeader from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { use } from "react"

export default function ApartmentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const apartmentId = Number.parseInt(id, 10)

  return (
    <>
      <PageHeader
        title="Chi tiết căn hộ"
        backUrl="/building-information/apartments"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/building-information/apartments/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>

      <ApartmentDetail apartmentId={apartmentId} />
      <ApartmentDrawer />
    </>
  )
}
