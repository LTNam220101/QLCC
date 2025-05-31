"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendRequest } from "../../../utils/api"

interface OTPVerificationProps {
  phoneNumber: string
  deviceId?: string
  onVerificationSuccess: () => void
  onCancel?: () => void
  onVerify?: (otpValue: string) => Promise<boolean>
}

export function OTPVerification({
  phoneNumber,
  deviceId,
  onVerificationSuccess,
  onCancel,
  onVerify
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [timeLeft, setTimeLeft] = useState<number>(180) // 3 minutes in seconds
  const [canResend, setCanResend] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCount, setResendCount] = useState<number>(0)
  const [resendLimitReached, setResendLimitReached] = useState<boolean>(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  // Format phone number for display (e.g., 098****000)
  const maskedPhone = phoneNumber.replace(/(\d{3})(\d{4})(\d{3})/, "$1****$3")

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    // Update OTP array
    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1) // Take only first character
    setOtp(newOtp)

    // Clear error when user types
    if (error) setError(null)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down events for navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      inputRefs.current[5]?.focus()
    }
  }

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend || resendLimitReached) return

    try {
      setError(null)
      const newResendCount = resendCount + 1
      setResendCount(newResendCount)

      // Check if resend limit reached (3 times in 60 minutes)
      if (newResendCount >= 3) {
        setResendLimitReached(true)
        setError("Bạn đã yêu cầu gửi OTP quá 3 lần trong 60 phút")
        return
      }

      // Gửi OTP
      const otpSent = await sendRequest<{ data: { exist: boolean } }>({
        method: "POST",
        url: "/auth/send-otp",
        body: {
          phoneNumber,
          deviceId,
        }
      })

      // Reset timer and disable resend button
      setTimeLeft(180)
      setCanResend(false)
    } catch (err) {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.")
    }
  }

  // Handle verification
  const handleVerify = async () => {
    // Check if OTP is complete
    if (otp.some((digit) => digit === "")) {
      setError("Vui lòng nhập đầy đủ mã OTP 6 số")
      return
    }

    try {
      setIsVerifying(true)
      setError(null)

      const otpString = otp.join("")

      // Use the provided onVerify function if available, otherwise use default behavior
      if (onVerify) {
        const isValid = await onVerify(otpString)

        if (isValid) {
          onVerificationSuccess()
        } else {
          setError("Mã OTP không chính xác. Vui lòng kiểm tra lại.")
        }
      } else {
        // Default behavior (for backward compatibility)
        setTimeout(() => {
          // For demo purposes, any 6-digit code is considered valid
          if (otpString.length === 6) {
            onVerificationSuccess()
          } else {
            setError("Mã OTP không chính xác. Vui lòng kiểm tra lại.")
          }
          setIsVerifying(false)
        }, 1000)
      }
    } catch (err) {
      console.error("Verification error:", err)
      setError("Đã xảy ra lỗi khi xác thực. Vui lòng thử lại.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-center mb-4">XÁC THỰC MÃ OTP</h2>

        <p className="text-center mb-6">
          Mã OTP đã được gửi qua số điện thoại:
          <br />
          <span className="font-medium">{maskedPhone}</span>
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Resend Section */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">Bạn chưa nhận được mã?</p>

          {canResend && !resendLimitReached ? (
            <Button
              variant="outline"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={handleResendOTP}
            >
              Gửi lại OTP
            </Button>
          ) : (
            <p className="text-sm text-gray-500 bg-gray-100 py-2 px-4 rounded inline-block">
              Gửi lại OTP sau {formatTime(timeLeft)}
            </p>
          )}

          {resendLimitReached && (
            <p className="text-red-500 text-sm mt-2">
              Bạn đã yêu cầu gửi OTP quá 3 lần trong 60 phút
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
          onClick={handleVerify}
          disabled={isVerifying || otp.some((digit) => digit === "")}
        >
          {isVerifying ? "Đang xác thực..." : "Xác nhận"}
        </Button>

        {onCancel && (
          <Button variant="ghost" className="w-full mt-2" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </div>
  )
}
