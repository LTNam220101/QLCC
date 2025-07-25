import React from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import Trash2 from "@/icons/trash.svg"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordInput } from "../ui/password-input"
import { useDeleteProfile } from "@/lib/tanstack-query/profiles/queries"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

const formSchema = z.object({
  password: z.string().trim().min(1, { message: "Vui lòng nhập mật khẩu" })
})
type FormValues = z.infer<typeof formSchema>

// Mock data for the form
const defaultValues: Partial<FormValues> = {
  password: ""
}
const DeleteAccountModal = () => {
  const router = useRouter()
  const deleteProfileMutation = useDeleteProfile()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange" // Kích hoạt validate realtime
  })

  const onSubmit = async () => {
    try {
      const a = await deleteProfileMutation.mutateAsync()
      console.log(a)
      // toast(`Đã xóa tài khoản, vui lòng đăng nhập lại`)
      // signOut({
      //   redirectTo: "/login",
      // });
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa tài khoản")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="warning"
          className="flex items-center gap-2 font-medium"
        >
          <Trash2 />
          Xoá tài khoản
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] gap-6">
        <div className="text-red font-bold text-2xl text-center">
          XÁC NHẬN XOÁ TÀI KHOẢN
        </div>
        <div className="text-center">
          Bạn có chắc xoá tài khoản? Vui lòng nhập mật khẩu để xác nhận xoá tài
          khoản
        </div>
        <Form {...form}>
          <form
            id="account-form"
            className="m-auto w-[336px] flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-normal after:content-['*'] after:ml-0.5 after:text-red-500">
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      value={field.value || ""}
                      className="rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant={form.formState.isValid ? "default" : "ghost"}
              className="mt-[60px] text-[22px] text-white rounded-[3px] h-[52px] w-[300px] mx-auto"
              type="submit"
            >
              Đồng ý
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAccountModal
