import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HotlineForm } from "@/components/hotline/hotline-form"
import { ChevronLeft } from "lucide-react"
import PageHeader from "@/components/common/page-header"

interface EditHotlinePageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: EditHotlinePageProps): Metadata {
  return {
    title: `Sửa Hotline #${params.id}`,
    description: "Chỉnh sửa thông tin hotline",
  }
}

export default function EditHotlinePage({ params }: EditHotlinePageProps) {
  const hotlineId = Number.parseInt(params.id)

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

        <PageHeader heading="Sửa Hotline" subheading="Chỉnh sửa thông tin hotline" />
      </div>

      <div className="border rounded-md p-6">
        <HotlineForm hotlineId={hotlineId} isEdit />
      </div>
    </div>
  )
}
