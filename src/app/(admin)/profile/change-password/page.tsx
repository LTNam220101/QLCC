"use client"

import React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"
import PageHeader from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const formSchema = z
  .object({
    password: z.string().trim().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z.string().trim().min(1, "Nhập mật khẩu mới"),
    newPassword2: z.string().trim().min(1, "Nhập lại mật khẩu mới")
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["newPassword"]
  })
  .refine((data) => data.newPassword === data.newPassword2, {
    message: "Mật khẩu mới không khớp",
    path: ["newPassword2"]
  })
type FormValues = z.infer<typeof formSchema>

const ChangePassword = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  })

  function onSubmit(data: FormValues) {
    // Here you would typically send the data to your API
    alert("Thông tin đã được lưu thành công!")
  }
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Đổi mật khẩu" backUrl="/profile/profile-info">
        <Button
          className="flex items-center my-[10px]"
          onClick={form.handleSubmit(onSubmit)}
        >
          <Check />
          Lưu
        </Button>
      </PageHeader>
      <Form {...form}>
        <form
          id="account-form"
          className="mt-5 w-[366px] flex flex-col gap-[30px]"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#666] text-md font-normal after:content-['*'] after:ml-0.5 after:text-red-500">
                  Mật khẩu hiện tại
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#666] text-md font-normal after:content-['*'] after:ml-0.5 after:text-red-500">
                  Mật khẩu mới
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#666] text-md font-normal after:content-['*'] after:ml-0.5 after:text-red-500">
                  Nhập lại mật khẩu mới
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default ChangePassword
