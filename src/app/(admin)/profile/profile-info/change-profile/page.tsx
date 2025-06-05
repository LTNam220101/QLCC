"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import PageHeader from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Pencil } from "lucide-react"
import CalendarIcon from "@/icons/calendar.svg"
import React from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import InfoRow from "@/components/common/info-row"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { vi } from "date-fns/locale"

const formSchema = z.object({
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(0|\+84)([0-9]{9,10})$/.test(val),
      "Số điện thoại không hợp lệ (phải có 10-11 số và bắt đầu bằng 0 hoặc +84)"
    ),
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự"),
  dateOfBirth: z.date({
    required_error: "Vui lòng chọn ngày sinh"
  }),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  department: z.string({
    required_error: "Vui lòng chọn phòng ban"
  }),
  idNumber: z.string().optional(),
  idIssueDate: z.date().optional(),
  idIssuePlace: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional()
})
type FormValues = z.infer<typeof formSchema>

// Mock data for the form
const defaultValues: Partial<FormValues> = {
  phoneNumber: "0912345678",
  fullName: "Nguyễn Văn A",
  dateOfBirth: new Date("1990-01-01"),
  email: "example@gmail.com",
  department: "it",
  idNumber: "123456789012",
  gender: "male"
}

// Mock data for read-only fields
const readOnlyData = {
  createBy: "Admin",
  createTime: "01/01/2023",
  updateBy: "Admin",
  updateTime: "01/06/2023"
}
const ChangeProfile = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  function onSubmit(data: FormValues) {
    // Here you would typically send the data to your API
    alert("Thông tin đã được lưu thành công!")
  }
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Sửa thông tin tài khoản"
        backUrl="/profile/profile-info"
      >
        <Button
          className="flex items-center my-[10px]"
          onClick={form.handleSubmit(onSubmit)}
        >
          <Pencil />
          Lưu
        </Button>
      </PageHeader>
      <Form {...form}>
        <form id="account-form" className="mt-5 space-y-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-7 gap-y-2">
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Nhập số điện thoại"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Họ và tên
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Ngày sinh
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal rounded-[3px]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: vi })
                            : null}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Phòng ban
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="it">Công nghệ thông tin</SelectItem>
                      <SelectItem value="hr">Nhân sự</SelectItem>
                      <SelectItem value="finance">Tài chính</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Vận hành</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Number */}
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số CMND/CCCD/Hộ chiếu</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Issue Date */}
            <FormField
              control={form.control}
              name="idIssueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày cấp CMND/CCCD/Hộ chiếu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal rounded-[3px]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: vi })
                            : null}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Issue Place */}
            <FormField
              control={form.control}
              name="idIssuePlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nơi cấp CMND/CCCD/Hộ chiếu</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Read-only information */}
          <div className="grid md:grid-cols-2 gap-x-10">
            <div>
              <InfoRow label="Người tạo" value={readOnlyData.createBy} />
              <InfoRow label="Người cập nhật" value={readOnlyData.updateBy} />
            </div>
            <div>
              <InfoRow label="Ngày tạo" value={readOnlyData.createTime} />
              <InfoRow label="Ngày cập nhật" value={readOnlyData.updateTime} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ChangeProfile
