import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HotlineFilters } from "@/components/hotline/hotline-filters"
import { HotlineTable } from "@/components/hotline/hotline-table"
import { Plus } from "lucide-react"
import PageHeader from "@/components/common/page-header"

export const metadata: Metadata = {
  title: "Quản lý Hotline",
  description: "Quản lý danh sách hotline của tòa nhà",
}

export default function HotlinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader heading="Quản lý Hotline" subheading="Quản lý danh sách hotline của tòa nhà" />

        <Button asChild>
          <Link href="/hotlines/add">
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Link>
        </Button>
      </div>

      <div className="border rounded-md p-4">
        <HotlineFilters />
      </div>

      <div className="border rounded-md">
        <div className="p-4">
          <h2 className="text-lg font-medium">Danh sách</h2>
        </div>

        <HotlineTable />
      </div>
    </div>
  )
}
