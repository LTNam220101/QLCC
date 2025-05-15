"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet"
import { useUserApartmentStore } from "@/lib/store/use-user-apartment-store"
import { toast } from "sonner"
import { FileUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useAddUserApartment,
  useUpdateUserApartment
} from "@/lib/tanstack-query/user-apartments/queries"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { UserApartmentFormData } from "../../../types/user-apartments"

// Schema xác thực form
const userApartmentFormSchema = z.object({
  userPhone: z.string().min(1, { message: "Số điện thoại là bắt buộc" }),
  userApartmentRole: z.number().min(1, { message: "Vai trò là bắt buộc" }),
  buildingId: z.string().min(1, { message: "Tòa nhà là bắt buộc" }),
  buildingName: z.string().min(1, { message: "Tòa nhà là bắt buộc" }),
  apartmentName: z.string().min(1, { message: "Căn hộ là bắt buộc" }),
  // area: z.coerce
  //   .number()
  //   .min(0, { message: "Diện tích phải lớn hơn hoặc bằng 0" }),
  note: z.string().optional()
})

export function UserApartmentDrawer() {
  const router = useRouter()
  const { drawerOpen, drawerType, selectedUserApartment, closeDrawer } =
    useUserApartmentStore()
  const { data: buildings } = useBuildings()
  const createUserApartmentMutation = useAddUserApartment()
  const updateUserApartmentMutation = useUpdateUserApartment()

  // Form
  const form = useForm<UserApartmentFormData>({
    resolver: zodResolver(userApartmentFormSchema),
    defaultValues: {
      userPhone: "",
      userApartmentRole: undefined,
      buildingId: "",
      buildingName: "",
      apartmentName: "",
      // area: undefined,
      note: ""
    }
  })

  // Cập nhật giá trị mặc định khi selectedUserApartment thay đổi
  useEffect(() => {
    if (selectedUserApartment && drawerType === "edit") {
      form.reset({
        userPhone: selectedUserApartment.userPhone || "",
        userApartmentRole: selectedUserApartment.userApartmentRole || undefined,
        buildingId: selectedUserApartment.buildingId || "",
        buildingName: selectedUserApartment.buildingName || "",
        apartmentName: selectedUserApartment.apartmentName || "",
        // area: selectedUserApartment.area || 0,
        note: selectedUserApartment.note || ""
      })
    } else if (drawerType === "add") {
      form.reset({
        userPhone: "",
        userApartmentRole: undefined,
        buildingId: "",
        buildingName: "",
        apartmentName: "",
        // area: undefined,
        note: ""
      })
    }
  }, [selectedUserApartment, drawerType, form])
  // Xử lý submit form
  const onSubmit = async (values: UserApartmentFormData) => {
    try {
      const data = {
        userPhone: values.userPhone ?? "",
        userApartmentRole: values.userApartmentRole ?? undefined,
        buildingId: values.buildingId ?? "",
        buildingName: values.buildingName ?? "",
        apartmentName: values.apartmentName ?? "",
        note: values.note ?? ""
        // area: values.area ?? 1
      }
      if (drawerType === "edit" && selectedUserApartment) {
        await updateUserApartmentMutation.mutateAsync({
          id: selectedUserApartment?.userApartmentMappingId,
          data
        })
        closeDrawer()
        toast("Thông tin liên kết đã được cập nhật")
        router.push("/building-information/userApartments")
      } else if (drawerType === "add") {
        await createUserApartmentMutation.mutateAsync(data)
        closeDrawer()
        toast("Căn hộ mới đã được tạo")
        router.push("/building-information/userApartments")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Tiêu đề drawer
  const drawerTitle =
    drawerType === "add"
      ? "Thêm mới liên kết"
      : drawerType === "edit"
      ? "Sửa liên kết"
      : "Thêm mới từ Excel"

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="sm:max-w-md md:max-w-xl">
        <SheetHeader>
          <SheetTitle>{drawerTitle}</SheetTitle>
        </SheetHeader>
        {(drawerType === "add" || drawerType === "edit") && (
          <Form {...form}>
            <form className="px-4 grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField
                control={form.control}
                name="userPhone"
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
                name="buildingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Tòa nhà
                    </FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e)
                        form.setValue(
                          "buildingName",
                          buildings?.find((build) => build.buildingId === e)
                            ?.buildingName || ""
                        )
                      }}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildings?.map((building) => (
                          <SelectItem
                            key={building.buildingId}
                            value={building.buildingId}
                          >
                            {building.buildingName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Căn hộ
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Diện tích (m²)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
            <SheetFooter className="flex-row justify-center">
              <Button
                type="button"
                className="rounded"
                variant="outline"
                onClick={closeDrawer}
              >
                Hủy
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="rounded">
                Lưu
              </Button>
            </SheetFooter>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  )
}