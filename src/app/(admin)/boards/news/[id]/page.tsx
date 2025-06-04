"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NewsDetail } from "@/components/news/news-detail"
import { Edit } from "lucide-react"
import PageHeader from "@/components/common/page-header"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { useNews } from "@/lib/tanstack-query/news/queries"

interface NewsDetailPageProps {
  params: Promise<{ id: string }>
}

export default function NewsDetailPage({
  params
}: NewsDetailPageProps) {
  const { id } = use(params)
  const { data: news } = useNews(id)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Chi tiết thông báo
            {news?.data && (
              <Badge
                variant={
                  news?.data?.status === 0
                    ? "gray_outline"
                    : "green_outline"
                }
                className="ml-3"
              >
                {news?.data?.status === 1 ? "Đã gửi" : "Đã lưu"}
              </Badge>
            )}
          </>
        }
        backUrl="/boards/news"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/boards/news/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>
      <NewsDetail newsId={id} />
    </div>
  )
}
