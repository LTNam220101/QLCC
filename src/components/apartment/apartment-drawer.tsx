"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet"
import { useApartmentStore } from "@/lib/store/use-apartment-store"
import { toast } from "sonner"
import { FileUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useAddApartment,
  useImportApartment,
  useUpdateApartment
} from "@/lib/tanstack-query/apartments/queries"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { ApartmentFormData } from "../../../types/apartments"
import { downloadApartmentTemplate } from "@/lib/services/apartment-service"

// Schema xác thực form
const apartmentFormSchema = z.object({
  apartmentName: z.string().min(1, { message: "Căn hộ là bắt buộc" }),
  buildingId: z.string().min(1, { message: "Tòa nhà là bắt buộc" }),
  buildingName: z.string().min(1, { message: "Tòa nhà là bắt buộc" }),
  area: z.coerce
    .number()
    .min(0, { message: "Diện tích phải lớn hơn hoặc bằng 0" }),
  note: z.string().optional()
})

export function ApartmentDrawer() {
  const router = useRouter()
  const { drawerOpen, drawerType, selectedApartment, closeDrawer } =
    useApartmentStore()
  const { data: buildings } = useBuildings()
  const createApartmentMutation = useAddApartment()
  const updateApartmentMutation = useUpdateApartment()

  // Form
  const form = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: {
      apartmentName: "",
      buildingId: "",
      buildingName: "",
      area: undefined,
      note: ""
    }
  })

  // Cập nhật giá trị mặc định khi selectedApartment thay đổi
  useEffect(() => {
    if (selectedApartment && drawerType === "edit") {
      form.reset({
        apartmentName: selectedApartment.apartmentName || "",
        buildingId: selectedApartment.buildingId || "",
        area: selectedApartment.area || 0,
        note: selectedApartment.note || ""
      })
    } else if (drawerType === "add") {
      form.reset({
        apartmentName: "",
        buildingId: "",
        area: undefined,
        note: ""
      })
    }
  }, [selectedApartment, drawerType, form])
  // Xử lý submit form
  const onSubmit = async (values: ApartmentFormData) => {
    try {
      const data = {
        apartmentName: values.apartmentName ?? "",
        buildingId: values.buildingId ?? "",
        buildingName: values.buildingName ?? "",
        note: values.note ?? "",
        area: values.area ?? 1
      }
      if (drawerType === "edit" && selectedApartment) {
        await updateApartmentMutation.mutateAsync({
          id: selectedApartment?.id,
          data
        })
        closeDrawer()
        toast("Thông tin căn hộ đã được cập nhật")
        router.push("/building-information/apartments")
      } else if (drawerType === "add") {
        await createApartmentMutation.mutateAsync(data)
        closeDrawer()
        toast("Căn hộ mới đã được tạo")
        router.push("/building-information/apartments")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Tiêu đề drawer
  const drawerTitle =
    drawerType === "add"
      ? "Thêm mới căn hộ"
      : drawerType === "edit"
      ? "Sửa căn hộ"
      : "Thêm mới từ Excel"

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="sm:max-w-md md:max-w-xl">
        <SheetHeader>
          <SheetTitle>{drawerTitle}</SheetTitle>
        </SheetHeader>
        {(drawerType === "add" || drawerType === "edit") && (
          <Form {...form}>
            <form className="px-4 grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField
                control={form.control}
                name="apartmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Căn hộ
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buildingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Tòa nhà
                    </FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e)
                        form.setValue(
                          "buildingName",
                          buildings?.find((build) => build.buildingId === e)
                            ?.buildingName || ""
                        )
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildings?.map((building) => (
                          <SelectItem
                            key={building.buildingId}
                            value={building.buildingId}
                          >
                            {building.buildingName}
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
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Diện tích (m²)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
            <SheetFooter className="flex-row justify-center">
              <Button
                type="button"
                className="rounded"
                variant="outline"
                onClick={closeDrawer}
              >
                Hủy
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="rounded">
                Lưu
              </Button>
            </SheetFooter>
          </Form>
        )}
        {drawerType === "import" && <ImportExcelForm />}
      </SheetContent>
    </Sheet>
  )
}

function ImportExcelForm() {
  const router = useRouter()
  const { closeDrawer } = useApartmentStore()
  const [file, setFile] = useState<File | null>(null)
  const importApartmentMutation = useImportApartment()

  const handleDownloadTemplate = async () => {
    try {
      await downloadApartmentTemplate()
      toast("Tải xuống thành công")
    } catch (error) {
      toast("Không thể tải xuống file mẫu")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    try {
      if (file) {
        await importApartmentMutation.mutateAsync(file)
        closeDrawer()
        toast("Vui lòng xem file kết quả")
        router.push("/building-information/apartments")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <div className="space-y-4 px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Hướng dẫn</h3>
            <Button
              variant="outline"
              className="border-blue text-blue hover:text-blue"
              onClick={handleDownloadTemplate}
            >
              <FileUp />
              Tải file Excel mẫu
            </Button>
          </div>
          <ol className="list-decimal list-inside space-y-2 p-4 border">
            <li>Tải file mẫu Excel</li>
            <li>Nhập dữ liệu vào file mẫu</li>
            <li>Chọn file và nhấn Đọc file Excel</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium">Tải file lên</h3>
          <div
            className="border-2 border-dashed rounded-md p-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <>
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500 mb-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 13h2" />
                    <path d="M14 17h2" />
                  </svg>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setFile(null)
                    }}
                  >
                    Xóa file
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2">
                  Kéo và thả file vào đây hoặc nhấn Chọn file để tải lên
                </p>
                <p className="text-sm text-muted-foreground">
                  File phải có định dạng Excel
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-blue text-blue hover:text-blue"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Plus />
                  Chọn file
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>

        {/* <div className="space-y-4 flex flex-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
          </div>
          <Button type="button" onClick={handleImport}>
            Đọc file
          </Button>
        </div> */}
      </div>
      <SheetFooter className="flex-row justify-center">
        <Button type="button" variant="outline" onClick={closeDrawer}>
          Đóng
        </Button>
        <Button type="button" onClick={handleImport}>
          Đọc file
        </Button>
      </SheetFooter>
    </>
  )
}
