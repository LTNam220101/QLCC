"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import { toast } from "sonner";
import { buildings, getDisplayName } from "@/lib/store/use-resident-store";
import { generateData } from "@/lib/create-data-apartment-table";
import TableData from "../common/table-data";

export function ApartmentTable() {
  const router = useRouter();
  const {
    filteredApartments,
    currentPage,
    itemsPerPage,
    totalItems,
    deleteDialogOpen,
    // apartmentToDelete,
    setCurrentPage,
    setItemsPerPage,
    setDeleteDialogOpen,
    setApartmentToDelete,
    deleteApartment,
    openDrawer,
  } = useApartmentStore();

  // Xử lý xóa căn hộ
  const handleDeleteClick = (id: string) => {
    setApartmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteApartment();
    toast("Đã xóa căn hộ khỏi hệ thống");
  };

  // Xử lý sửa căn hộ
  const handleEditClick = (id: number) => {
    const apartment = filteredApartments.find((apt) => apt.id === id);
    if (apartment) {
      openDrawer("edit", apartment);
    }
  };

  // Xử lý xem chi tiết căn hộ
  const handleViewClick = (id: number) => {
    router.push(`/apartments/${id}`);
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredApartments.slice(startIndex, endIndex);

  const columns = generateData({ router, handleDeleteClick });

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
              value={itemsPerPage.toString()}
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
            <DialogTitle>Xác nhận xóa căn hộ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa căn hộ này? Hành động này không thể hoàn
              tác.
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
