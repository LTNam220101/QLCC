"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";

// Định nghĩa schema xác thực form
const loginSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tài khoản" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Kiểm tra xem người dùng vừa đăng ký thành công hay vừa đặt lại mật khẩu
  const justRegistered = searchParams.get("registered") === "true";
  const passwordReset = searchParams.get("reset") === "true";

  // Khởi tạo form với React Hook Form và Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Xử lý khi submit form
  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      // Giả lập API call
      console.log("Login data:", data);

      // Giả lập delay xử lý
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Giả lập đăng nhập thành công - trong thực tế sẽ gọi API
      if (data.username === "admin" && data.password === "Password123") {
        // Chuyển hướng đến trang dashboard sau khi đăng nhập thành công
        router.push("/dashboard");
      } else {
        // Hiển thị lỗi đăng nhập
        setLoginError("Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[#666] mb-2">Đăng nhập hệ thống</h1>
        <h2 className="text-[28px] text-purple">
          Quản lý tòa nhà [Tên tòa nhà/Khu chung cư]
        </h2>
      </div>

      {justRegistered && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.
          </AlertDescription>
        </Alert>
      )}

      {passwordReset && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.
          </AlertDescription>
        </Alert>
      )}

      {loginError && (
        <Alert variant="destructive">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Số điện thoại hoặc email"
                    {...field}
                    className="rounded-md"
                  />
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
                <FormLabel>Mật khẩu</FormLabel>
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
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center text-[#666]">
              <Checkbox className="border-[#d9d9d9] mr-2" /> Nhớ cho lần sau
            </div>
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={!form.formState.isValid || isSubmitting}
            className="w-full"
            size={"xl"}
            variant={form.formState.isValid ? "purple" : "ghost"}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}
          </Button>
        </form>
      </Form>

      <div className="text-start">
        <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
        <Link
          href="/register"
          className="text-blue-600 hover:underline text-sm"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
}
