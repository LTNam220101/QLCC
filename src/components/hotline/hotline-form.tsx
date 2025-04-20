"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { useCreateHotline, useUpdateHotline, useHotline } from "@/lib/tanstack-query/hotlines/queries"
import { toast } from "sonner";

// Schema validation
const formSchema = z.object({
  name: z.string().min(1, "Tên hiển thị không được để trống"),
  phoneNumber: z
    .string()
    .min(1, "Số hotline không được để trống")
    .regex(/^[0-9]+$/, "Số hotline chỉ được chứa số"),
  buildingId: z.string().min(1, "Vui lòng chọn tòa nhà"),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface HotlineFormProps {
  hotlineId?: number
  isEdit?: boolean
}

export function HotlineForm({ hotlineId, isEdit = false }: HotlineFormProps) {
  const router = useRouter()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const { data: hotline, isLoading: isLoadingHotline } = useHotline(hotlineId || 0)
  const createHotlineMutation = useCreateHotline()
  const updateHotlineMutation = useUpdateHotline(hotlineId || 0)

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      buildingId: "",
      note: "",
    },
  })

  // Cập nhật form khi có dữ liệu hotline
  useEffect(() => {
    if (isEdit && hotline) {
      form.reset({
        name: hotline.name,
        phoneNumber: hotline.phoneNumber,
        buildingId: hotline.buildingId.toString(),
        note: hotline.note || "",
      })
    }
  }, [form, hotline, isEdit])

  // Xử lý submit form
  const onSubmit = async (values: FormValues) => {
    try {
      const data = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        buildingId: Number.parseInt(values.buildingId),
        note: values.note,
      }

      if (isEdit && hotlineId) {
        await updateHotlineMutation.mutateAsync(data)
        toast("Thông tin hotline đã được cập nhật")
        router.push("/hotlines")
      } else {
        await createHotlineMutation.mutateAsync(data)
        toast("Hotline mới đã được tạo")
        router.push("/hotlines")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Xử lý lưu tạm
  const handleSaveDraft = () => {
    const values = form.getValues()
    // Lưu vào localStorage hoặc xử lý lưu tạm khác
    localStorage.setItem("hotline-draft", JSON.stringify(values))
    toast("Thông tin hotline đã được lưu tạm")
  }

  // Loading state
  const isLoading = isLoadingBuildings || (isEdit && isLoadingHotline)
  const isSubmitting = form.formState.isSubmitting || createHotlineMutation.isPending || updateHotlineMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số hotline</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số hotline" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên hiển thị</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên hiển thị" {...field} disabled={isLoading} />
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
                <FormLabel>Tòa nhà</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tòa nhà" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {buildings?.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú" className="min-h-[120px]" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push("/hotlines")} disabled={isSubmitting}>
            Hủy
          </Button>

          {!isEdit && (
            <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
              Lưu tạm
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
