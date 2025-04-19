"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Định nghĩa schema xác thực form
const forgotPasswordSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tài khoản" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo form với React Hook Form và Zod
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: "",
    },
  });

  // Xử lý khi submit form
  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Giả lập API call
      console.log("Forgot password data:", data);

      // Giả lập delay xử lý
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Chuyển hướng đến trang đặt lại mật khẩu
      router.push(
        `/reset-password?username=${encodeURIComponent(data.username)}`
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[#666] mb-2">Cấp lại mật khẩu</h1>
        <h2 className="text-[28px] text-purple">
          Quản lý tòa nhà [Tên tòa nhà/Khu chung cư]
        </h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <FormControl>
                  <Input placeholder="Số điện thoại hoặc email" {...field} />
                </FormControl>
                <FormMessage />
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
            {isSubmitting ? "Đang xử lý..." : "Tiếp theo"}
          </Button>
        </form>
      </Form>

      <div className="text-start">
        <Link href="/login" className="text-blue-600 hover:underline text-sm">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
