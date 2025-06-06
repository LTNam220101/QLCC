"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import {
  useCreateMovingTicket,
  useUpdateMovingTicket,
  useMovingTicket
} from "@/lib/tanstack-query/moving-tickets/queries"
import { toast } from "sonner"
import Calendar from "@/icons/calendar.svg"
import { MovingTicketFormData } from "../../../types/moving-tickets"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { vi } from "date-fns/locale"
import { TransferType } from "@/enum"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"

// Schema validation
const formSchema = z.object({
  movingDayTime: z.number({
    required_error: "Ngày chuyển đồ là bắt buộc"
  }),
  expectedTime: z.string().min(1, "Thời gian dự kiến không được để trống"),
  transferType: z.number().min(0, "Hình thức không được để trống"),
  apartmentId: z.string(),
  buildingId: z.string(),
  note: z.string().optional()
})

interface MovingTicketFormProps {
  movingTicketId?: string
  isEdit?: boolean
}

export function MovingTicketForm({
  movingTicketId,
  isEdit = false
}: MovingTicketFormProps) {
  const router = useRouter()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const { data: movingTicket, isLoading: isLoadingMovingTicket } =
    useMovingTicket(movingTicketId)
  const createMovingTicketMutation = useCreateMovingTicket()
  const updateMovingTicketMutation = useUpdateMovingTicket(movingTicketId)

  // Form
  const form = useForm<MovingTicketFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movingDayTime: undefined,
      expectedTime: "",
      transferType: undefined,
      apartmentId: "",
      buildingId: "",
      note: ""
    }
  })
  const watchBuilding = form.watch("buildingId")
  const { data: apartments } = useApartments(
    {
      manageBuildingList: [watchBuilding],
      page: 0,
      size: 1000
    },
    !!watchBuilding
  )

  // Cập nhật form khi có dữ liệu moving-ticket
  useEffect(() => {
    if (!isEdit) {
      form.reset({
        movingDayTime: undefined,
        expectedTime: "",
        transferType: undefined,
        apartmentId: "",
        buildingId: "",
        note: ""
      })
    } else if (isEdit && movingTicket) {
      form.reset({
        movingDayTime: movingTicket.data?.movingDayTime,
        expectedTime: movingTicket.data?.expectedTime || "",
        transferType: movingTicket.data?.transferType,
        apartmentId: movingTicket.data?.apartmentId || "",
        buildingId: movingTicket.data?.buildingId || "",
        note: movingTicket.data?.note || ""
      })
    }
  }, [form, movingTicket, isEdit, buildings, apartments])
  // Xử lý submit form
  const onSubmit = async (values: MovingTicketFormData) => {
    try {
      const data = {
        movingDayTime: values.movingDayTime ?? "",
        expectedTime: values.expectedTime ?? "",
        transferType: values.transferType ?? "",
        apartmentId: values.apartmentId ?? "",
        buildingId: values.buildingId ?? "",
        note: values.note ?? ""
      }

      if (isEdit && movingTicketId) {
        await updateMovingTicketMutation.mutateAsync({
          ...movingTicket?.data,
          ...data
        })
        toast("Thông tin đăng ký chuyển đồ đã được cập nhật")
        router.push("/services/moving-tickets")
      } else {
        await createMovingTicketMutation.mutateAsync(data)
        toast("MovingTicket mới đã được tạo")
        router.push("/services/moving-tickets")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Loading state
  const isLoading = isLoadingBuildings || (isEdit && isLoadingMovingTicket)
  const isSubmitting =
    form.formState.isSubmitting ||
    createMovingTicketMutation.isPending ||
    updateMovingTicketMutation.isPending

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pt-8 px-7 relative bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="movingDayTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày chuyển đồ</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="xl"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd/MM/yyyy", { locale: vi })
                          : null}
                        <Calendar className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                        selected={new Date(field.value)}
                        onSelect={(e) => {
                          field.onChange(e?.getTime())
                        }}
                        locale={vi}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian dự kiến</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isLoading}
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
            name="apartmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Căn hộ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {apartments?.data?.data?.map((apartment) => (
                      <SelectItem key={apartment.id} value={apartment?.id}>
                        {apartment.apartmentName}
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
            name="transferType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình thức</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(+e)
                  }}
                  value={`${field.value}` || ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"1"}>{TransferType[1]}</SelectItem>
                    <SelectItem value={"0"}>{TransferType[0]}</SelectItem>
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
                <Textarea
                  className="min-h-[120px] rounded-[3px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="absolute -top-[60px] right-7 flex items-center justify-end space-x-2">
          {isEdit ? (
            <Button
              className="flex items-center my-[10px] border-green text-green"
              variant={"outline"}
              disabled={isSubmitting}
              type="button"
              onClick={() => { form?.reset() }}
            >
              Huỷ bỏ
            </Button>
          ) : null}
          <Button
            className="flex items-center my-[10px]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Lưu lại" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
