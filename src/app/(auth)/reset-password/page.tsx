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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";

// Định nghĩa schema xác thực form
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo form với React Hook Form và Zod
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Xử lý khi submit form
  async function onSubmit(data: ResetPasswordFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Giả lập API call
      console.log("Reset password data:", { username, ...data });

      // Giả lập delay xử lý
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Chuyển hướng đến trang đăng nhập với thông báo đặt lại mật khẩu thành công
      router.push("/login?reset=true");
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.");
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    className="rounded-[3px]"
                  />
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
                <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    className="rounded-[3px]"
                  />
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
