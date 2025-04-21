"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Eye, Trash, Upload, X, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  useDocumentStore,
  buildings,
  getDisplayName,
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

export function DocumentDrawer() {
  const {
    drawerOpen,
    drawerType,
    selectedDocument,
    selectedFile,
    closeDrawer,
    addDocument,
    updateDocument,
    uploadFiles,
    setFileToDelete,
    setDeleteDialogOpen,
    fileToDelete,
    deleteFile,
    openDrawer,
  } = useDocumentStore();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpenState] = useState(false);

  // Form
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
      building: "",
      note: "",
    },
  });

  // Cập nhật giá trị mặc định khi selectedDocument thay đổi
  useEffect(() => {
    if (selectedDocument && (drawerType === "edit" || drawerType === "view")) {
      form.reset({
        name: selectedDocument.name,
        building: selectedDocument.building,
        effectiveDate: new Date(selectedDocument.effectiveDate),
        note: selectedDocument.note || "",
      });
      setUploadedFiles([]);
      setRemovedFileIds([]);
    } else if (drawerType === "add") {
      form.reset({
        name: "",
        building: "",
        note: "",
      });
      setUploadedFiles([]);
      setRemovedFileIds([]);
    }
  }, [selectedDocument, drawerType, form]);

  // Xử lý submit form
  const onSubmit = (data: DocumentFormValues) => {
    if (drawerType === "add") {
      addDocument(
        {
          ...data,
          effectiveDate: format(data.effectiveDate, "yyyy-MM-dd"),
        },
        uploadedFiles
      );
      toast({
        title: "Thêm mới thành công",
        description: "Tài liệu đã được thêm vào hệ thống",
      });
    } else if (drawerType === "edit" && selectedDocument) {
      updateDocument(
        selectedDocument.id,
        {
          ...data,
          effectiveDate: format(data.effectiveDate, "yyyy-MM-dd"),
        },
        uploadedFiles,
        removedFileIds
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin tài liệu đã được cập nhật",
      });
    }
    form.reset();
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

  // Xử lý xóa file đã lưu
  const handleRemoveSavedFile = (documentId: number, fileId: number) => {
    setFileToDelete({ documentId, fileId });
    setDeleteDialogOpen(true);
  };

  // Xử lý đánh dấu file để xóa (khi cập nhật)
  const handleMarkFileForRemoval = (fileId: number) => {
    setRemovedFileIds((prev) => [...prev, fileId]);
  };

  // Xử lý xem trước file
  const handlePreviewFile = (url: string) => {
    setPreviewUrl(url);
  };

  // Tiêu đề drawer
  const drawerTitle =
    drawerType === "add"
      ? "Thêm mới tài liệu căn hộ"
      : drawerType === "edit"
      ? "Sửa tài liệu căn hộ"
      : drawerType === "view"
      ? "Chi tiết tài liệu căn hộ"
      : drawerType === "upload"
      ? "Tải file lên"
      : "Xem file";

  // Render nội dung drawer
  const renderDrawerContent = () => {
    switch (drawerType) {
      case "add":
      case "edit":
        return renderFormContent();
      case "view":
        return renderViewContent();
      case "upload":
        return renderUploadContent();
      case "preview":
        return renderPreviewContent();
      default:
        return null;
    }
  };

  // Render form thêm/sửa
  const renderFormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tài liệu căn hộ</FormLabel>
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
              <FormLabel>Tòa nhà</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormLabel>Ngày hiệu lực</FormLabel>
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "dd/MM/yyyy", { locale: vi })
                        : "Chọn ngày hiệu lực"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
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
                {selectedDocument &&
                  selectedDocument.files
                    .filter((file) => !removedFileIds.includes(file.id))
                    .map((file, index) => (
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
                      {selectedDocument
                        ? selectedDocument.files.filter(
                            (f) => !removedFileIds.includes(f.id)
                          ).length +
                          index +
                          1
                        : index + 1}
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

                {selectedDocument?.files.filter(
                  (f) => !removedFileIds.includes(f.id)
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

        <SheetFooter>
          <Button type="button" variant="outline" onClick={closeDrawer}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </SheetFooter>
      </form>
    </Form>
  );

  // Render nội dung xem chi tiết
  const renderViewContent = () => {
    if (!selectedDocument) return null;

    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Chi tiết tài liệu căn hộ</h2>
          <Badge
            className={
              selectedDocument.status === "active"
                ? "bg-green-100 text-green-800"
                : selectedDocument.status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {selectedDocument.status === "active"
              ? "Đang hiệu lực"
              : selectedDocument.status === "inactive"
              ? "Chưa hiệu lực"
              : "Hết hiệu lực"}
          </Badge>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Thông tin chung</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-md">
            <div className="grid grid-cols-2 border-b md:border-r">
              <div className="p-4 bg-gray-50 font-medium border-r">
                Tên tài liệu căn hộ
              </div>
              <div className="p-4">{selectedDocument.name}</div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-4 bg-gray-50 font-medium border-r">Tòa nhà</div>
              <div className="p-4">
                {getDisplayName(selectedDocument.building, buildings)}
              </div>
            </div>

            <div className="grid grid-cols-2 border-b md:border-r">
              <div className="p-4 bg-gray-50 font-medium border-r">
                Ngày hiệu lực
              </div>
              <div className="p-4">{selectedDocument.effectiveDate}</div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-4 bg-gray-50 font-medium border-r">Ghi chú</div>
              <div className="p-4">{selectedDocument.note || "Không có"}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">File đính kèm</h3>
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
                {selectedDocument.files.length > 0 ? (
                  selectedDocument.files.map((file, index) => (
                    <TableRow key={file.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewFile(file.url)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
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
          <h3 className="text-lg font-medium mb-4">Thông tin khác</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-md">
            <div className="grid grid-cols-2 border-b md:border-r">
              <div className="p-4 bg-gray-50 font-medium border-r">
                Người tạo
              </div>
              <div className="p-4">{selectedDocument.createBy}</div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-4 bg-gray-50 font-medium border-r">
                Ngày tạo
              </div>
              <div className="p-4">{selectedDocument.createTime}</div>
            </div>

            <div className="grid grid-cols-2 md:border-r">
              <div className="p-4 bg-gray-50 font-medium border-r">
                Người cập nhật
              </div>
              <div className="p-4">{selectedDocument.updateBy}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-4 bg-gray-50 font-medium border-r">
                Ngày cập nhật
              </div>
              <div className="p-4">{selectedDocument.updateTime}</div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={closeDrawer}>
            Đóng
          </Button>
          <Button
            type="button"
            onClick={() =>
              selectedDocument && handleEditClick(selectedDocument)
            }
          >
            Sửa
          </Button>
        </SheetFooter>
      </div>
    );
  };

  // Xử lý chuyển sang chế độ sửa
  const handleEditClick = (document: any) => {
    closeDrawer();
    setTimeout(() => {
      openDrawer("edit", document);
    }, 100);
  };

  // Render nội dung tải file lên
  const renderUploadContent = () => (
    <div className="space-y-6 py-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tải file lên</h3>
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <p className="mb-2">
            Kéo và thả file vào đây hoặc nhấn Chọn file để tải lên
          </p>
          <p className="text-sm text-muted-foreground">
            File phải có định dạng Word, PDF, PNG, IMG
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              document.getElementById("file-upload-dialog")?.click()
            }
          >
            <Upload className="mr-2 h-4 w-4" />
            Chọn file
          </Button>
          <input
            id="file-upload-dialog"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          />
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">File đã tải lên</h3>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">
                    {file.name.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full w-full"></div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveUploadedFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SheetFooter>
        <Button type="button" variant="outline" onClick={closeDrawer}>
          Đóng
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (selectedDocument && uploadedFiles.length > 0) {
              uploadFiles(selectedDocument.id, uploadedFiles);
              toast(`Đã tải lên ${uploadedFiles.length} file`);
            }
          }}
          disabled={uploadedFiles.length === 0}
        >
          Lưu
        </Button>
      </SheetFooter>
    </div>
  );

  // Render nội dung xem trước file
  const renderPreviewContent = () => (
    <div className="space-y-6 py-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={closeDrawer} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Quay lại</span>
        </Button>
      </div>

      <div className="h-[600px] border rounded-md overflow-hidden">
        {selectedFile && (
          <iframe
            src={selectedFile.url}
            className="w-full h-full"
            title={selectedFile.name}
            frameBorder="0"
          ></iframe>
        )}
        {previewUrl && !selectedFile && (
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title="Preview"
            frameBorder="0"
          ></iframe>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{drawerTitle}</SheetTitle>
          </SheetHeader>

          {renderDrawerContent()}
        </SheetContent>
      </Sheet>

      {/* Dialog xác nhận xóa file */}
      <Dialog
        open={deleteDialogOpen && fileToDelete !== null}
        onOpenChange={setDeleteDialogOpen}
      >
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
            <Button variant="destructive" onClick={deleteFile}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
