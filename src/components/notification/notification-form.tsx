"use client"

import { useEffect, useMemo } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import {
  useCreateNotification,
  useUpdateNotification,
  useNotification
} from "@/lib/tanstack-query/notifications/queries"
import { toast } from "sonner"
import Calendar from "@/icons/calendar.svg"
import { NotificationFormData } from "../../../types/notifications"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarComponent } from "../ui/calendar"
import { MinimalTiptapEditor } from "../minimal-tiptap"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

// Schema validation
const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Tiêu đề không được để trống"),
  buildingId: z.string().min(1, "Toà nhà không được để trống"),
  apartmentId: z.string().optional(),
  sentTime: z.number()
})

interface NotificationFormProps {
  notificationId?: string
  isEdit?: boolean
}

export function NotificationForm({
  notificationId,
  isEdit = false
}: NotificationFormProps) {
  const router = useRouter()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const { data: notification, isLoading: isLoadingNotification } =
    useNotification(notificationId)
  const createNotificationMutation = useCreateNotification()
  const updateNotificationMutation = useUpdateNotification(notificationId)

  const currentDate = useMemo(() => {
    return new Date().getTime()
  }, [])
  // Form
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(formSchema),
    values: {
      title: "",
      content: "",
      buildingId: "",
      apartmentId: "",
      sentTime: currentDate
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
  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = new Date(form.getValues("sentTime")) || new Date()
    let newDate = new Date(currentDate)

    if (type === "hour") {
      const hour = parseInt(value, 10)
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour)
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10))
    } else if (type === "ampm") {
      const hours = newDate.getHours()
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12)
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12)
      }
    }

    form.setValue("sentTime", newDate.getTime())
  }
  // Cập nhật form khi có dữ liệu notification
  useEffect(() => {
    if (isEdit && notification) {
      form.reset({
        title: notification.data?.title,
        content: notification.data?.content,
        buildingId: notification.data?.buildingId,
        apartmentId: notification.data?.apartmentId,
        sentTime: notification.data?.sentTime
      })
    }
  }, [form, notification, isEdit])

  // Cập nhật form khi có dữ liệu apartments
  useEffect(() => {
    if (apartments) {
      form.resetField("apartmentId")
    }
  }, [form, apartments])

  // Xử lý submit form
  const onSubmit = async (values: NotificationFormData) => {
    try {
      const data = {
        title: values.title ?? "",
        content: values.content ?? "",
        buildingId: values.buildingId ?? "",
        apartmentId: values.apartmentId ?? "",
        sentTime: values.sentTime ?? ""
      }

      if (isEdit && notificationId) {
        await updateNotificationMutation.mutateAsync(data)
        toast("Thông tin notification đã được cập nhật")
        router.push("/boards/notifications")
      } else {
        await createNotificationMutation.mutateAsync(data)
        localStorage.removeItem("notification-draft")
        toast("Notification mới đã được tạo")
        router.push("/boards/notifications")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Loading state
  const isLoading = isLoadingBuildings || (isEdit && isLoadingNotification)
  const isSubmitting =
    form.formState.isSubmitting ||
    createNotificationMutation.isPending ||
    updateNotificationMutation.isPending

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pt-8 px-7 relative bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Tiêu đề
                </FormLabel>
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
                <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Tòa nhà
                </FormLabel>
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
                        value={building?.buildingId}
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
            name="sentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian gửi</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        size="xl"
                      >
                        {field.value
                          ? format(field.value, "dd/MM/yyyy hh:mm aa", {
                            locale: vi
                          })
                          : null}
                        <Calendar className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="sm:flex">
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
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        new Date(field.value).getHours() % 12 ===
                                        hour % 12
                                        ? "black"
                                        : "transparent"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("hour", hour.toString())
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 60 }, (_, i) => i).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        new Date(field.value).getMinutes() ===
                                        minute
                                        ? "black"
                                        : "transparent"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "minute",
                                        minute.toString()
                                      )
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                      ((ampm === "AM" &&
                                        new Date(field.value).getHours() < 12) ||
                                        (ampm === "PM" &&
                                          new Date(field.value).getHours() >= 12))
                                      ? "black"
                                      : "transparent"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleTimeChange("ampm", ampm)}
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                Nội dung
              </FormLabel>
              <FormControl>
                <MinimalTiptapEditor
                  {...field}
                  className="w-full"
                  editorContentClassName="p-5"
                  output="html"
                  placeholder="Enter your description..."
                  autofocus={true}
                  editable={true}
                  editorClassName="focus:outline-hidden"
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
