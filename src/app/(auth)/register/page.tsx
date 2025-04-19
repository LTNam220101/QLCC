"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/ui/password-input";

// Định nghĩa schema xác thực form
const registerSchema = z
  .object({
    phone: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
      .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    fullName: z
      .string()
      .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Vui lòng chọn giới tính",
    }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
      }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khởi tạo form với React Hook Form và Zod
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      email: "",
      fullName: "",
      gender: "male",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange",
  });

  // Xử lý khi submit form
  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true);

    try {
      // Giả lập API call
      console.log("Form data:", data);

      // Giả lập delay xử lý
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[#666] mb-2">Đăng ký tài khoản</h1>
        <h2 className="text-[28px] text-purple">
          Quản lý tòa nhà [Tên tòa nhà/Khu chung cư]
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Số điện thoại
                </FormLabel>
                <FormControl>
                  <Input placeholder="0901234567" {...field} />
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
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="gap-3">
                <FormLabel className="font-medium">Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-2"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Nam
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Nữ
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Khác
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <PasswordInput
                      {...field}
                      value={field.value || ""}
                      className="rounded-md"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Nhập lại mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <PasswordInput
                      {...field}
                      value={field.value || ""}
                      className="rounded-md"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="m-0"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Tôi đã đọc và đồng ý với{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Điều khoản sử dụng
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-[3px]"
            disabled={!form.formState.isValid || isSubmitting}
            size={"xl"}
            variant={form.formState.isValid ? "purple" : "ghost"}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng Ký"}
          </Button>
        </form>
      </Form>

      <div className="text-start -mt-1">
        <Link href="/login" className="text-blue-600 hover:underline text-sm">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
