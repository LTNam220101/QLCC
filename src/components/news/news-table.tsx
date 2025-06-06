"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNewsFilterStore } from "@/lib/store/use-news-filter-store"
import {
  useNewss,
  useDeleteNews
} from "@/lib/tanstack-query/news/queries"
import { toast } from "sonner"
import { generateData } from "../../../utils/create-table/create-data-news-table"
import TableData from "../common/table-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { News } from "../../../types/news"
import { useRouter } from "next/navigation"
import { useProfile } from "@/lib/tanstack-query/profiles/queries"

export function NewsTable() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const { filter, setFilter, resetFilter } = useNewsFilterStore()
  const { data, isLoading, isError, isRefetching } = useNewss(filter)
  const deleteNewsMutation = useDeleteNews()

  const [newsToDelete, setNewsToDelete] =
    useState<News | null>(null)

  // Xử lý xóa news
  const handleDelete = async () => {
    if (!newsToDelete) return

    try {
      await deleteNewsMutation.mutateAsync(
        newsToDelete.newsId
      )
      toast(`Đã xóa news`)
      setNewsToDelete(null)
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa news")
    }
  }
  const columns = generateData({
    profile: profile,
    startIndex: filter?.size * filter?.page || 0,
    handleDeleteClick: (news) => {
      setNewsToDelete(news)
    },
  })

  // Render lỗi
  if (isError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    )
  }
  // Render khi không có dữ liệu
  if (data?.data?.data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Không có dữ liệu</p>
          <Button onClick={resetFilter}>Đặt lại bộ lọc</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-[22px] bg-white rounded-lg px-8 flex-1">
      <div className="text-lg font-semibold text-[#303438] my-[16.5px]">Danh sách</div>
      <TableData<News>
        datas={data?.data?.data}
        columns={columns}
        isLoading={isLoading || isRefetching}
        filters={filter}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, news) => {
          router.push(`/boards/news/${news.newsId}`)
        }}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!newsToDelete}
        onOpenChange={(open) => !open && setNewsToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa news</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa news{" "}
              {`${newsToDelete?.title}`}? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewsToDelete(null)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
