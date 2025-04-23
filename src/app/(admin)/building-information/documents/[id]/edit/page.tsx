"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Calendar, Check, Eye, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
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

// Schema xác thực form
const documentFormSchema = z.object({
  name: z.string().min(1, { message: "Tên tài liệu là bắt buộc" }),
  building: z.string().min(1, { message: "Tòa nhà là bắt buộc" }),
  effectiveDate: z.date({ required_error: "Ngày hiệu lực là bắt buộc" }),
  note: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export default function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { documents, updateDocument, setFileToDelete, deleteFile } =
    useDocumentStore();
  const documentId = Number.parseInt(id, 10);

  const [document, setDocument] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setLocalFileToDelete] = useState<{
    documentId: number;
    fileId: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
      building: "",
      note: "",
    },
  });

  useEffect(() => {
    const foundDocument = documents.find((doc) => doc.id === documentId);
    if (foundDocument) {
      setDocument(foundDocument);
      form.reset({
        name: foundDocument.name,
        building: foundDocument.building,
        effectiveDate: new Date(foundDocument.effectiveDate),
        note: foundDocument.note || "",
      });
    } else {
      router.push("/building-information/documents");
    }
  }, [documentId, documents, router, form]);

  // Xử lý submit form
  const onSubmit = async (data: DocumentFormValues) => {
    setIsSubmitting(true);
    try {
      updateDocument(
        documentId,
        {
          ...data,
          effectiveDate: format(data.effectiveDate, "yyyy-MM-dd"),
        },
        uploadedFiles,
        removedFileIds
      );
      toast("Thông tin tài liệu đã được cập nhật");
      router.push(`/building-information/documents/${documentId}`);
    } catch (error) {
      toast("Có lỗi xảy ra khi cập nhật tài liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý tải file lên
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Xử lý xóa file đã tải lên
  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý đánh dấu file để xóa
  const handleMarkFileForRemoval = (fileId: number) => {
    setRemovedFileIds((prev) => [...prev, fileId]);
  };

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
            <Link href={`/building-information/documents/${documentId}`}>
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Quay lại</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-4">Sửa tài liệu căn hộ</h1>
        </div>
        <Button
          type="submit"
          form="document-form"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Đang lưu...</span>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Lưu
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          id="document-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Tên tài liệu căn hộ
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên tài liệu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="building"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Tòa nhà
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tòa nhà" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Ngày hiệu lực
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd/MM/yyyy", { locale: vi })
                          : null}
                        <Calendar className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={vi}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập ghi chú" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">File đính kèm</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Thêm mới file
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </div>

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
                  {/* Hiển thị các file đã lưu */}
                  {document.files
                    .filter((file: any) => !removedFileIds.includes(file.id))
                    .map((file: any, index: number) => (
                      <TableRow key={`saved-${file.id}`}>
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
                              onClick={() => handleMarkFileForRemoval(file.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* Hiển thị các file mới tải lên */}
                  {uploadedFiles.map((file, index) => (
                    <TableRow key={`new-${index}`}>
                      <TableCell>
                        {document.files.filter(
                          (f: any) => !removedFileIds.includes(f.id)
                        ).length +
                          index +
                          1}
                      </TableCell>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUploadedFile(index)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {document.files.filter(
                    (f: any) => !removedFileIds.includes(f.id)
                  ).length === 0 &&
                    uploadedFiles.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-6 text-muted-foreground"
                        >
                          Chưa có file nào được đính kèm
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </div>
          </div>
        </form>
      </Form>

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
