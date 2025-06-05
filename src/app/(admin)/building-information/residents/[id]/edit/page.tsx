"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Calendar from "@/icons/calendar.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import PageHeader from "@/components/common/page-header"
import InfoRow from "@/components/common/info-row"
import StatusBadge from "@/components/common/status-badge"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import {
  useResident,
  useUpdateResident
} from "@/lib/tanstack-query/residents/queries"
import { ResidentFormData } from "../../../../../../../types/residents"

// Schema xác thực form
export const residentFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  dateOfBirth: z.number({
    required_error: "Ngày sinh là bắt buộc"
  }),
  email: z.union([z.string().email(), z.literal(""), z.undefined()]),
  identifyId: z.string().min(1, "Số CMND/CCCD/Hộ chiếu là bắt buộc"),
  identifyIssueDate: z.number({
    required_error: "Ngày cấp CMND/CCCD/Hộ chiếu là bắt buộc"
  }),
  identifyIssuer: z.string().min(1, "Nơi cấp CMND/CCCD/Hộ chiếu là bắt buộc"),
  gender: z.number().optional()
})

export default function EditResidentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)

  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const { data: resident, isLoading: isLoadingResident } = useResident(id)
  const updateResidentMutation = useUpdateResident()

  // Form
  const form = useForm<ResidentFormData>({
    resolver: zodResolver(residentFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      identifyId: "",
      identifyIssueDate: undefined,
      identifyIssuer: "",
      gender: undefined,
      dateOfBirth: undefined
    }
  })

  // Cập nhật form khi có dữ liệu hotline
  useEffect(() => {
    if (resident?.data) {
      form.reset({
        fullName: resident?.data?.fullName ?? "",
        phoneNumber: resident?.data?.phoneNumber ?? "",
        email: resident?.data?.email ?? "",
        identifyId: resident?.data?.identifyId ?? "",
        identifyIssueDate: resident?.data?.identifyIssueDate ?? "",
        identifyIssuer: resident?.data?.identifyIssuer ?? "",
        gender: resident?.data?.gender ?? undefined,
        dateOfBirth: resident?.data?.dateOfBirth ?? ""
      })
    }
  }, [form, resident?.data])

  const onSubmit = async (values: ResidentFormData) => {
    try {
      const data = {
        fullName: values?.fullName ?? "",
        phoneNumber: values?.phoneNumber ?? "",
        email: values?.email ?? "",
        identifyId: values?.identifyId ?? "",
        identifyIssueDate: values?.identifyIssueDate ?? "",
        identifyIssuer: values?.identifyIssuer ?? "",
        gender: values?.gender ?? undefined,
        dateOfBirth: values?.dateOfBirth ?? ""
      }

      await updateResidentMutation.mutateAsync({ id, data })
      toast("Thông tin cư dân đã được cập nhật")
      router.push("/building-information/residents")
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Loading state
  const isLoading = isLoadingBuildings || isLoadingResident
  const isSubmitting =
    form.formState.isSubmitting || updateResidentMutation.isPending

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Cập nhật cư dân
            {resident?.data?.status ? (
              <StatusBadge
                status={resident?.data?.status}
                className="ml-2"
              />
            ) : null}
          </>
        }
        backUrl={`/building-information/residents/${id}`}
      >
        <div className="flex items-center gap-3">
          <Button
            className="flex items-center my-[10px] text-green border-green"
            onClick={() => form.reset()}
            disabled={isSubmitting}
            variant="outline"
            type="button"
          >
            Huỷ bỏ
          </Button>
          <Button
            className="flex items-center my-[10px] rounded-md"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Lưu lại"}
          </Button>
        </div>
      </PageHeader>

      <Form {...form}>
        <form id="resident-form" className="space-y-4 py-4 bg-white px-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Họ và tên
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Ngày sinh
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="xl"
                          disabled={isLoading}
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: vi })
                            : null}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1960}
                          toYear={2030}
                          selected={new Date(field.value)}
                          onSelect={(e) => field.onChange(e?.getTime())}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identifyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Số CMND/CCCD/Hộ chiếu
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identifyIssueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Ngày cấp CMND/CCCD/Hộ chiếu
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="xl"
                          disabled={isLoading}
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: vi })
                            : null}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1960}
                          toYear={2030}
                          selected={new Date(field.value)}
                          onSelect={(e) => field.onChange(e?.getTime())}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
              name="identifyIssuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Nơi cấp CMND/CCCD/Hộ chiếu
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(+e)
                    }}
                    value={field.value ? `${field.value}` : ""}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isLoading} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Nam</SelectItem>
                      <SelectItem value="0">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-bold">Thông tin khác</h2>
            <div className="grid md:grid-cols-2 gap-x-10">
              <div>
                <InfoRow label="Người tạo" value={resident?.data?.createBy} />
                <InfoRow
                  label="Người cập nhật"
                  value={resident?.data?.updateBy}
                />
              </div>
              <div>
                <InfoRow label="Ngày tạo" value={resident?.data?.createTime} />
                <InfoRow
                  label="Ngày cập nhật"
                  value={resident?.data?.updateTime}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
