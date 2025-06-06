"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import {
  useCreateReport,
  useUpdateReport,
  useReport
} from "@/lib/tanstack-query/reports/queries"
import { toast } from "sonner"
import {
  FeedbackImage,
  ReportFormData,
  UploadedImage
} from "../../../types/reports"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"
import { ImageUpload } from "../ui/image-upload"

// Schema validation
const formSchema = z.object({
  reportContent: z.string().min(1, "Nội dung không được để trống"),
  apartmentId: z.string(),
  // .min(1, "Căn hộ không được để trống"),
  buildingId: z.string().min(1, "Toà nhà không được để trống"),
  note: z.string().optional()
})

interface ReportFormProps {
  reportId?: string
  isEdit?: boolean
}

export function ReportForm({ reportId, isEdit = false }: ReportFormProps) {
  const router = useRouter()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const { data: report, isLoading: isLoadingReport } = useReport(reportId)
  const createReportMutation = useCreateReport()
  const updateReportMutation = useUpdateReport(reportId)

  const [images, setImages] = useState<(FeedbackImage | UploadedImage)[]>([])

  // Form
  const form = useForm<ReportFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      apartmentId: "",
      reportContent: "",
      note: ""
    }
  })
  const watchBuilding = form.watch("buildingId")
  const { data: apartments } = useApartments(
    {
      manageBuildingList: [watchBuilding],
      page: 0,
      size: 1000
    },
    !!watchBuilding
  )

  // Cập nhật form khi có dữ liệu report
  useEffect(() => {
    if (!isEdit) {
      form.reset({
        buildingId: "",
        apartmentId: "",
        reportContent: "",
        note: ""
      })
    } else if (isEdit && report) {
      form.reset({
        buildingId: report.data?.buildingId || "",
        apartmentId: report.data?.apartmentId || "",
        reportContent: report.data?.reportContent || "",
        note: report.data?.note || ""
      })
    }
  }, [form, report, isEdit, buildings, apartments])

  // Cập nhật form khi có dữ liệu apartments
  useEffect(() => {
    if (apartments && form) {
      form.resetField("apartmentId")
    }
  }, [form, apartments])

  // Xử lý submit form
  const onSubmit = async (values: ReportFormData) => {
    try {
      const data = {
        buildingId: values.buildingId ?? "",
        apartmentId: values.apartmentId ?? "",
        reportContent: values.reportContent ?? "",
        note: values.note ?? ""
      }

      if (isEdit && reportId) {
        await updateReportMutation.mutateAsync({ ...report?.data, ...data })
        toast("Thông tin đã được cập nhật")
        router.push("/services/reports")
      } else {
        await createReportMutation.mutateAsync(data)
        toast("Report mới đã được tạo")
        router.push("/services/reports")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  const handleImagesChange = (newImages: UploadedImage[]) => {
    // Kết hợp ảnh đã có và ảnh mới upload
    const existingImages = images.filter(
      (img: FeedbackImage) => !("file" in img)
    )
    setImages([...existingImages, ...newImages])
  }

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter((img: FeedbackImage) => img.id !== imageId))
  }

  // Loading state
  const isLoading = isLoadingBuildings || (isEdit && isLoadingReport)
  const isSubmitting =
    form.formState.isSubmitting ||
    createReportMutation.isPending ||
    updateReportMutation.isPending

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pt-8 px-7 relative bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="buildingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tòa nhà</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isLoading}
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
            name="apartmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Căn hộ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {apartments?.data?.data?.map((apartment) => (
                      <SelectItem key={apartment.id} value={apartment?.id}>
                        {apartment.apartmentName}
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
            name="reportContent"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[120px] rounded-[3px]"
                    {...field}
                    disabled={isLoading}
                  />
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
                  <Textarea
                    className="min-h-[120px] rounded-[3px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <h3 className="text-base font-medium mb-4">File đính kèm</h3>
            {/* Hiển thị ảnh đã có */}
            {images.filter((img: FeedbackImage) => !("file" in img)).length >
              0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Ảnh đã tải lên</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images
                    .filter((img: FeedbackImage) => !("file" in img))
                    .map((image: FeedbackImage) => (
                      <div
                        key={image.id}
                        className="relative group rounded-lg overflow-hidden border border-gray-200"
                      >
                        <div className="aspect-square relative">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.name}
                            className="object-cover w-full h-full"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(image.id)}
                          >
                            <span className="sr-only">Xóa</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </Button>
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-gray-600 truncate">
                            {image.name}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <ImageUpload
              onImagesChange={handleImagesChange}
              maxImages={10}
              maxFileSize={5}
            />
          </div>
        </div>

        <div className="absolute -top-[60px] right-7 flex items-center justify-end space-x-2">
          {isEdit ? (
            <Button
              className="flex items-center my-[10px] border-green text-green"
              variant={"outline"}
              disabled={isSubmitting}
              type="button"
              onClick={() => {
                form?.reset()
              }}
            >
              Huỷ bỏ
            </Button>
          ) : null}
          <Button
            className="flex items-center my-[10px]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Lưu lại" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
