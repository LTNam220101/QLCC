"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocumentStore, buildings } from "@/lib/store/use-document-store";
import { toast } from "sonner";
import PageHeader from "@/components/common/page-header";
import { DocumentFilters } from "@/components/document/document-filters";
import { DocumentTable } from "@/components/document/document-table";

export default function ApartmentDocumentsPage() {
  const {
    filteredDocuments,
    currentPage,
    itemsPerPage,
    totalItems,
    deleteDialogOpen,
    applyFilters,
    setCurrentPage,
    setItemsPerPage,
    setDeleteDialogOpen,
    setDocumentToDelete,
    deleteDocument,
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

  // Tính toán phân trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredDocuments.slice(startIndex, endIndex);

  // Render badge trạng thái
  const renderStatusBadge = (status: string) => {
    let bgColor = "bg-gray-100 text-gray-800";

    if (status === "active") {
      bgColor = "bg-green-100 text-green-800";
    } else if (status === "expired") {
      bgColor = "bg-red-100 text-red-800";
    }

    const statusName =
      status === "active"
        ? "Đang hiệu lực"
        : status === "inactive"
        ? "Chưa hiệu lực"
        : "Hết hiệu lực";

    return <Badge className={bgColor}>{statusName}</Badge>;
  };

  // Áp dụng bộ lọc khi component được mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div>
      <PageHeader title="Quản lý tài liệu căn hộ">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/building-information/documents/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-6" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>

      {/* Bộ lọc */}
      <DocumentFilters />

      <DocumentTable />
    </div>
  );
}
