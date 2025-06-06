"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuildings } from "@/lib/tanstack-query/buildings/queries";
import {
  useCreateHotline,
  useUpdateHotline,
  useHotline,
} from "@/lib/tanstack-query/hotlines/queries";
import { toast } from "sonner";
import { HotlineFormData } from "../../../types/hotlines";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import CalendarComponent from "@/icons/calendar.svg"
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Schema validation
const formSchema = z.object({
  name: z.string().min(1, "Tên hiển thị không được để trống"),
  hotline: z
    .string()
    .min(1, "Số hotline không được để trống")
    .regex(/^[0-9]+$/, "Số hotline chỉ được chứa số"),
  buildingId: z.string(),
  effectiveDate: z.number().min(0, { message: "Ngày hiệu lực không được để trống" }),
  note: z.string().optional(),
  status: z.number().optional(),
});

interface HotlineFormProps {
  hotlineId?: string;
  isEdit?: boolean;
}

export function HotlineForm({ hotlineId, isEdit = false }: HotlineFormProps) {
  const router = useRouter();
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings();
  const { data: hotline, isLoading: isLoadingHotline } = useHotline(hotlineId);
  const createHotlineMutation = useCreateHotline();
  const updateHotlineMutation = useUpdateHotline(hotlineId);

  // Form
  const form = useForm<HotlineFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hotline: "",
      buildingId: "",
      note: "",
      effectiveDate: undefined,
    },
  });

  // Cập nhật form khi có dữ liệu hotline
  useEffect(() => {
    if (!isEdit) {
      const draft = JSON.parse(localStorage.getItem("hotline-draft") || "{}");
      form.reset({
        name: "",
        hotline: "",
        buildingId: "",
        note: "",
        effectiveDate: undefined,
        ...draft,
      });
    } else if (isEdit && hotline) {
      form.reset({
        name: hotline.data?.name,
        hotline: hotline.data?.hotline,
        buildingId: hotline.data?.buildingId,
        note: hotline.data?.note || "",
        effectiveDate: hotline.data?.effectiveDate,
      });
    }
  }, [form, hotline, isEdit]);

  // Xử lý submit form
  const onSubmit = async (values: HotlineFormData) => {
    try {
      const data = {
        name: values.name ?? "",
        hotline: values.hotline ?? "",
        buildingId: values.buildingId ?? "",
        note: values.note ?? "",
        status: values.status ?? 1,
        effectiveDate: values.effectiveDate ?? undefined,
      };

      if (isEdit && hotlineId) {
        await updateHotlineMutation.mutateAsync(data);
        toast("Thông tin hotline đã được cập nhật");
        router.push("/services/hotlines");
      } else {
        await createHotlineMutation.mutateAsync(data);
        localStorage.removeItem("hotline-draft");
        toast("Hotline mới đã được tạo");
        router.push("/services/hotlines");
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  // Loading state
  const isLoading = isLoadingBuildings || (isEdit && isLoadingHotline);
  const isSubmitting =
    form.formState.isSubmitting ||
    createHotlineMutation.isPending ||
    updateHotlineMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pt-8 px-7 relative bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="hotline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số hotline</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
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
                        value={building?.buildingId?.toString()}
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
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày hiệu lực</FormLabel>
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
                        {field.value ? format(field.value, "dd/MM/yyyy") : "-"}
                        <CalendarComponent className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                        locale={vi}
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date.getTime())
                          }
                        }}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
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
            className="flex items-center my-[10px] rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Lưu lại" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
