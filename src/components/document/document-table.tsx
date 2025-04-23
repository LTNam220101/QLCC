"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocumentStore } from "@/lib/store/use-document-store";
import { toast } from "sonner";
import TableData from "../common/table-data";
import { generateData } from "../../../utils/create-table/create-data-document-table";

export function DocumentTable() {
  const {
    filteredDocuments,
    currentPage,
    itemsPerPage,
    totalItems,
    deleteDialogOpen,
    // documentToDelete,
    setCurrentPage,
    setItemsPerPage,
    setDeleteDialogOpen,
    setDocumentToDelete,
    deleteDocument,
    openDrawer,
  } = useDocumentStore();

  // Xử lý xóa tài liệu
  const handleDeleteClick = (id: number) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteDocument();
    toast("Đã xóa tài liệu khỏi hệ thống");
  };

  // Xử lý sửa tài liệu
  const handleEditClick = (id: number) => {
    const document = filteredDocuments.find((doc) => doc.id === id);
    if (document) {
      openDrawer("edit", document);
    }
  };

  // Xử lý xem chi tiết tài liệu
  const handleViewClick = (id: number) => {
    const document = filteredDocuments.find((doc) => doc.id === id);
    if (document) {
      openDrawer("view", document);
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredDocuments.slice(startIndex, endIndex);

  const columns = generateData({ handleDeleteClick });

  return (
    <div className="space-y-4">
      {/* Danh sách căn hộ */}
      <TableData columns={columns} datas={currentItems} />

      {/* Phân trang */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Tổng số {totalItems} bản ghi
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Select
              value={itemsPerPage?.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={`${itemsPerPage}/trang`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10/trang</SelectItem>
                <SelectItem value="20">20/trang</SelectItem>
                <SelectItem value="50">50/trang</SelectItem>
                <SelectItem value="100">100/trang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;

                // Nếu có nhiều trang và đang ở trang sau
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;

                  // Đảm bảo không vượt quá tổng số trang
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i);
                  }
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài liệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
