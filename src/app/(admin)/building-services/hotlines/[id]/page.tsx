import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HotlineDetail } from "@/components/hotline/hotline-detail"
import { ChevronLeft, Edit } from "lucide-react"
import PageHeader from "@/components/common/page-header"

interface HotlineDetailPageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: HotlineDetailPageProps): Metadata {
  return {
    title: `Chi tiết Hotline #${params.id}`,
    description: "Xem chi tiết thông tin hotline",
  }
}

export default function HotlineDetailPage({ params }: HotlineDetailPageProps) {
  const hotlineId = Number.parseInt(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hotlines">
                <ChevronLeft className="h-4 w-4" />
                <span>Quản lý</span>
              </Link>
            </Button>
          </div>

          <PageHeader heading="Chi tiết Hotline" subheading="Xem thông tin chi tiết của hotline" />
        </div>

        <Button asChild>
          <Link href={`/hotlines/${hotlineId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Sửa
          </Link>
        </Button>
      </div>

      <div className="border rounded-md p-6">
        <HotlineDetail hotlineId={hotlineId} />
      </div>
    </div>
  )
}
