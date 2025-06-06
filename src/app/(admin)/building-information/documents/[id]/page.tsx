"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Trash from "@/icons/trash.svg"
import { ArrowLeft, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDocumentStore,
  buildings,
  formatFileSize,
} from "@/lib/store/use-document-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { documents, setFileToDelete, deleteFile } = useDocumentStore();
  const documentId = Number.parseInt(id, 10);
  const [document, setDocument] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setLocalFileToDelete] = useState<{
    documentId: number;
    fileId: number;
  } | null>(null);

  useEffect(() => {
    const foundDocument = documents.find((doc) => doc.id === documentId);
    if (foundDocument) {
      setDocument(foundDocument);
    } else {
      router.push("/building-information/documents");
    }
  }, [documentId, documents, router]);

  // Xử lý xem trước file
  const handlePreviewFile = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  // Xử lý xóa file
  const handleDeleteFile = (documentId: number, fileId: number) => {
    setLocalFileToDelete({ documentId, fileId });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFile = () => {
    if (fileToDelete) {
      setFileToDelete(fileToDelete);
      deleteFile();
      setDeleteDialogOpen(false);
      toast("Đã xóa file khỏi tài liệu");
    }
  };

  if (!document) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link href="/building-information/documents">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Quay lại</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-4">Chi tiết tài liệu căn hộ</h1>
          <Badge
            className={
              document.status === "active"
                ? "bg-green-100 text-green-800"
                : document.status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {document.status === "active"
              ? "Đang hiệu lực"
              : document.status === "inactive"
              ? "Chưa hiệu lực"
              : "Hết hiệu lực"}
          </Badge>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/building-information/documents/${document.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-md">
          <div className="grid grid-cols-2 border-b md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Tên tài liệu căn hộ
            </div>
            <div className="p-4">{document.name}</div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 bg-gray-50 font-medium border-r">Tòa nhà</div>
            <div className="p-4">
              {buildings.find((b) => b.id === document.building)?.name ||
                document.building}
            </div>
          </div>

          <div className="grid grid-cols-2 border-b md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Ngày hiệu lực
            </div>
            <div className="p-4">{document.effectiveDate}</div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 bg-gray-50 font-medium border-r">Ghi chú</div>
            <div className="p-4">{document.note || "Không có"}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">File đính kèm</h2>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">STT</TableHead>
                <TableHead>Tên file</TableHead>
                <TableHead>Dung lượng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {document.files.length > 0 ? (
                document.files.map((file: any, index: number) => (
                  <TableRow key={file.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewFile(file.url)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFile(document.id, file.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Không có file đính kèm
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Thông tin khác</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-md">
          <div className="grid grid-cols-2 border-b md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">Người tạo</div>
            <div className="p-4">{document.createBy}</div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 bg-gray-50 font-medium border-r">Ngày tạo</div>
            <div className="p-4">{document.createTime}</div>
          </div>

          <div className="grid grid-cols-2 md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Người cập nhật
            </div>
            <div className="p-4">{document.updateBy}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Ngày cập nhật
            </div>
            <div className="p-4">{document.updateTime}</div>
          </div>
        </div>
      </div>

      {/* Dialog xem trước file */}
      {previewOpen && previewUrl && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Xem trước file</DialogTitle>
            </DialogHeader>
            <div className="h-full overflow-auto">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Preview"
                frameBorder="0"
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog xác nhận xóa file */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa file</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa file này? Hành động này không thể hoàn
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
            <Button variant="destructive" onClick={confirmDeleteFile}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
