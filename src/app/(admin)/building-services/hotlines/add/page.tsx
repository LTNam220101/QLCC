import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HotlineForm } from "@/components/hotline/hotline-form"
import { ChevronLeft } from "lucide-react"
import PageHeader from "@/components/common/page-header"

export const metadata: Metadata = {
  title: "Thêm mới Hotline",
  description: "Thêm mới hotline cho tòa nhà",
}

export default function AddHotlinePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hotlines">
              <ChevronLeft className="h-4 w-4" />
              <span>Quản lý</span>
            </Link>
          </Button>
        </div>

        <PageHeader heading="Thêm mới Hotline" subheading="Thêm mới hotline cho tòa nhà" />
      </div>

      <div className="border rounded-md p-6">
        <HotlineForm />
      </div>
    </div>
  )
}
