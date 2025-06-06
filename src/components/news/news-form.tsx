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
  useCreateNews,
  useUpdateNews,
  useNews
} from "@/lib/tanstack-query/news/queries"
import { toast } from "sonner"
import Calendar from "@/icons/calendar.svg"
import { NewsFormData } from "../../../types/news"
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
  content: z.string().min(1, "Nội dung không được để trống"),
  buildingId: z.string().min(1, "Toà nhà không được để trống"),
  sentTime: z.number()
})

interface NewsFormProps {
  newsId?: string
  isEdit?: boolean
}

export function NewsForm({ newsId, isEdit = false }: NewsFormProps) {
  const router = useRouter()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const { data: news, isLoading: isLoadingNews } = useNews(newsId)
  const createNewsMutation = useCreateNews()
  const updateNewsMutation = useUpdateNews(newsId)

  const currentDate = useMemo(() => {
    return new Date().getTime()
  }, [])
  // Form
  const form = useForm<NewsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      buildingId: "",
      sentTime: currentDate
    }
  })

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
  // Cập nhật form khi có dữ liệu news
  useEffect(() => {
    if (isEdit && news) {
      form.reset({
        title: news.data?.title,
        content: news.data?.content,
        buildingId: news.data?.buildingId,
        sentTime: news.data?.sentTime
      })
    }
  }, [form, news, isEdit, buildings])
  // Xử lý submit form
  const onSubmit = async (values: NewsFormData) => {
    try {
      const data = {
        title: values.title ?? "",
        content: values.content ?? "",
        buildingId: values.buildingId ?? "",
        sentTime: values.sentTime ?? ""
      }

      if (isEdit && newsId) {
        await updateNewsMutation.mutateAsync(data)
        toast("Thông tin news đã được cập nhật")
        router.push("/boards/news")
      } else {
        await createNewsMutation.mutateAsync(data)
        localStorage.removeItem("news-draft")
        toast("News mới đã được tạo")
        router.push("/boards/news")
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  // Loading state
  const isLoading = isLoadingBuildings || (isEdit && isLoadingNews)
  const isSubmitting =
    form.formState.isSubmitting ||
    createNewsMutation.isPending ||
    updateNewsMutation.isPending

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
            name="sentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian gửi</FormLabel>
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
