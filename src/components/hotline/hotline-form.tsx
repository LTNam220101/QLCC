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
import { Check } from "lucide-react";
import { HotlineFormData } from "../../../types/hotlines";

// Schema validation
const formSchema = z.object({
  name: z.string().min(1, "Tên hiển thị không được để trống"),
  hotline: z
    .string()
    .min(1, "Số hotline không được để trống")
    .regex(/^[0-9]+$/, "Số hotline chỉ được chứa số"),
  buildingId: z.string(),
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
        ...draft,
      });
    } else if (isEdit && hotline) {
      form.reset({
        name: hotline.data?.name,
        hotline: hotline.data?.hotline,
        buildingId: hotline.data?.buildingId,
        note: hotline.data?.note || "",
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

  // Xử lý lưu tạm
  const handleSaveDraft = () => {
    const values = form.getValues();
    // Lưu vào localStorage hoặc xử lý lưu tạm khác
    localStorage.setItem("hotline-draft", JSON.stringify(values));
    toast("Thông tin hotline đã được lưu tạm");
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
        className="space-y-6 mt-5 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  defaultValue={field.value}
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
                        key={building.id}
                        value={building.id.toString()}
                      >
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
                <Textarea
                  placeholder="Nhập ghi chú"
                  className="min-h-[120px] rounded-[3px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="absolute -top-[80px] right-0 flex items-center justify-end space-x-2">
          {!isEdit && (
            <Button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-md"
              disabled={isSubmitting}
            >
              <Check className="size-4" />
              Lưu tạm
            </Button>
          )}
          <Button
            className="flex items-center my-[10px] rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            <Check className="size-4" />
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
