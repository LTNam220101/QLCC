"use client"

import { NewsForm } from "@/components/news/news-form"
import PageHeader from "@/components/common/page-header"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { useNews } from "@/lib/tanstack-query/news/queries"

interface EditNewsPageProps {
  params: Promise<{ id: string }>
}

export default function EditNewsPage({
  params
}: EditNewsPageProps) {
  const { id } = use(params)
  const { data: news } = useNews(id)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Sửa bảng tin
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
        backUrl={`/boards/news/${id}`}
      />
      <NewsForm newsId={id} isEdit />
    </div>
  )
}
