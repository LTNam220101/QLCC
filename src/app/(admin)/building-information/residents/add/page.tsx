"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Calendar, Check } from "lucide-react"
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
import { residentFormSchema } from "../[id]/edit/page"
import { ResidentFormData } from "../../../../../../types/residents"
import { useAddResident } from "@/lib/tanstack-query/residents/queries"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"

export default function AddResidentPage() {
  const router = useRouter()
  const { data: buildings } = useBuildings()
  const addResidentMutation = useAddResident()

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
      await addResidentMutation.mutateAsync(data)
      toast("Cư dân mới đã được thêm vào hệ thống")
      router.push("/building-information/residents")
    } catch (error) {
      toast("Có lỗi xảy ra khi thêm cư dân mới")
    }
  }

  // Loading state
  const isSubmitting =
    form.formState.isSubmitting || addResidentMutation.isPending

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={<>Thêm mới cư dân</>}
        backUrl={`/building-information/residents`}
      >
        <Button
          className="flex items-center my-[10px] rounded-md"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Check className="size-4" />
          {isSubmitting ? "Đang xử lý..." : "Lưu"}
        </Button>
      </PageHeader>

      <Form {...form}>
        <form id="resident-form" className="space-y-4 my-[30px]">
          <h2 className="font-bold">Thông tin chung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                          disabled={isSubmitting}
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                          disabled={isSubmitting}
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
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h2 className="font-bold">Thông tin khác</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
            {/* <FormField
              control={form.control}
              name="moveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày chuyển đến</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            /> */}
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
                    value={`${field.value}` || ""}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isSubmitting} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Nam</SelectItem>
                      <SelectItem value="0">Nữ</SelectItem>
                      {/* <SelectItem value="Khác">Khác</SelectItem> */}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
