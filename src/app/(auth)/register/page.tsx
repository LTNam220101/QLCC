"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { sendRequest } from "../../../../utils/api"
import { OTPVerification } from "@/components/common/otp-verification"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription } from "@/components/ui/alert"
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Định nghĩa schema xác thực form
const registerSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
      .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng"
    }),
    uuid: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"]
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [registrationData, setRegistrationData] =
    useState<RegisterFormValues | null>(null)

  // Khởi tạo form với React Hook Form và Zod
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
      uuid: uuidv4()
    },
    mode: "onChange"
  })

  // Xử lý khi submit form
  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true)
    setLoginError(null)

    try {
      // Kiểm tra số điện thoại đã tồn tại chưa
      const res = await sendRequest<{ data: { exist: boolean } }>({
        method: "POST",
        url: "/user/is-exist",
        body: {
          phoneNumber: data?.phoneNumber
        }
      })

      if (res?.data?.exist === true) {
        setLoginError("Số điện thoại đã được đăng ký, vui lòng điền số khác")
        setIsSubmitting(false)
        return
      }

      // Lưu dữ liệu đăng ký để sử dụng sau khi xác thực OTP
      setRegistrationData(data)

      // Gửi OTP
      const otpSent = await sendRequest<{ data: { exist: boolean } }>({
        method: "POST",
        url: "/auth/send-otp",
        body: {
          phoneNumber: data?.phoneNumber,
          deviceId: data?.uuid
        }
      })
      setShowOTPModal(true)
      if (otpSent) {
        // Hiển thị modal xác thực OTP
      } else {
        setShowOTPModal(false)
        setLoginError("Không thể gửi mã OTP. Vui lòng thử lại sau.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setLoginError("Đã xảy ra lỗi. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hàm xác thực OTP
  async function verifyOTP(otpValue: string): Promise<boolean> {
    if (!registrationData) return false

    try {
      // Trong môi trường thực tế, bạn sẽ gọi API để xác thực OTP
      // Ví dụ:
      const response = await sendRequest({
        method: "POST",
        url: "/auth/verify-otp",
        body: {
          phoneNumber: registrationData.phoneNumber,
          otp: otpValue,
          deviceId: registrationData?.uuid
        }
      })
      if (response?.status === "success") {
        localStorage.setItem("tokenRegister", response?.data?.token)
        return true
      }
      return false
    } catch (error) {
      console.error("OTP verification error:", error)
      return false
    }
  }

  // Xử lý khi xác thực OTP thành công
  const handleOTPVerificationSuccess = async () => {
    if (!registrationData) return

    setIsSubmitting(true)
    setLoginError(null)

    try {
      // Gửi API đăng ký
      await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        // by default setting the content-type to be json type
        headers: new Headers({
          "content-type": "application/json",
          // Thêm Authorization header nếu token được cung cấp
          Authorization: `Bearer ${localStorage.getItem("tokenRegister") || ""}`
        }),
        body: JSON.stringify({
          phoneNumber: registrationData?.phoneNumber,
          password: registrationData?.password,
          confirmPassword: registrationData?.confirmPassword
        })
      }).then((res) => {
        if (res.ok) {
          // Đóng modal OTP
          setShowOTPModal(false)

          // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
          router.push("/login?registered=true")
          return
        } else {
          // Đóng modal OTP
          setShowOTPModal(false)
          setLoginError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.")
          return;
        }
      })
    } catch (error) {
      console.error("Registration error:", error)
      setLoginError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
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
      {loginError && (
        <Alert variant="destructive">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Số điện thoại
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

      {/* OTP Verification Modal */}
      {showOTPModal && registrationData && (
        <OTPVerification
          phoneNumber={registrationData.phoneNumber}
          deviceId={registrationData.uuid}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onCancel={() => setShowOTPModal(false)}
          onVerify={verifyOTP}
        />
      )}
    </div>
  )
}
