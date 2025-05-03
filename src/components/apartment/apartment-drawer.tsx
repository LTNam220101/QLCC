"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import { toast } from "sonner";
import { FileUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useAddApartment,
  useUpdateApartment,
} from "@/lib/tanstack-query/apartments/queries";
import { useBuildings } from "@/lib/tanstack-query/buildings/queries";
import { ApartmentFormData } from "../../../types/apartments";

// Schema xác thực form
const apartmentFormSchema = z.object({
  apartmentName: z.string().min(1, { message: "Căn hộ là bắt buộc" }),
  manageBuildingList: z
    .array(z.string())
    .min(1, { message: "Tòa nhà là bắt buộc" }),
  area: z.coerce
    .number()
    .min(0, { message: "Diện tích phải lớn hơn hoặc bằng 0" }),
  note: z.string().optional(),
});

export function ApartmentDrawer() {
  const router = useRouter();
  const { drawerOpen, drawerType, selectedApartment, closeDrawer } =
    useApartmentStore();
  const { data: buildings } = useBuildings();
  const createApartmentMutation = useAddApartment();
  const updateApartmentMutation = useUpdateApartment();

  // Form
  const form = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: {
      apartmentName: "",
      manageBuildingList: undefined,
      area: 0,
      note: "",
    },
  });

  // Cập nhật giá trị mặc định khi selectedApartment thay đổi
  useEffect(() => {
    if (selectedApartment && drawerType === "edit") {
      form.reset({
        apartmentName: selectedApartment.apartmentName || "",
        manageBuildingList: [selectedApartment.buildingId],
        area: selectedApartment.area || 0,
        note: selectedApartment.note || "",
      });
    } else if (drawerType === "add") {
      form.reset({
        apartmentName: "",
        manageBuildingList: undefined,
        area: 0,
        note: "",
      });
    }
  }, [selectedApartment, drawerType, form]);

  // Xử lý submit form
  const onSubmit = async (values: ApartmentFormData) => {
    try {
      const data = {
        apartmentName: values.apartmentName ?? "",
        manageBuildingList: values.manageBuildingList ?? "",
        note: values.note ?? "",
        area: values.area ?? 1,
      };

      if (drawerType === "edit" && selectedApartment) {
        await updateApartmentMutation.mutateAsync({
          id: selectedApartment?.id,
          data,
        });
        closeDrawer();
        toast("Thông tin căn hộ đã được cập nhật");
        router.push("/building-information/apartments");
      } else if (drawerType === "add") {
        await createApartmentMutation.mutateAsync(data);
        closeDrawer();
        toast("Căn hộ mới đã được tạo");
        router.push("/building-information/apartments");
      }
    } catch (error) {
      toast("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  // Tiêu đề drawer
  const drawerTitle =
    drawerType === "add"
      ? "Thêm mới căn hộ"
      : drawerType === "edit"
      ? "Sửa căn hộ"
      : "Thêm mới từ Excel";

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="sm:max-w-md md:max-w-xl">
        <SheetHeader>
          <SheetTitle>{drawerTitle}</SheetTitle>
        </SheetHeader>
        {(drawerType === "add" || drawerType === "edit") && (
          <Form {...form}>
            <form className="px-4 grid grid-cols-2 gap-x-5 gap-y-4">
              {/* <FormField
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
              /> */}

              <FormField
                control={form.control}
                name="manageBuildingList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                      Tòa nhà
                    </FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange([e]);
                      }}
                      defaultValue={field.value?.[0]}
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
              />

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
        {drawerType === "import" && <ImportExcelForm />}
      </SheetContent>
    </Sheet>
  );
}

function ImportExcelForm() {
  const { closeDrawer, importApartments } = useApartmentStore();

  const handleImport = () => {
    // Giả lập nhập dữ liệu từ Excel
    const excelData = [
      {
        apartmentNumber: "E-501",
        building: "E",
        area: 85.5,
        vehicleCount: 1,
        vehicleType: "car",
        note: "Căn hộ nhập từ Excel",
      },
      {
        apartmentNumber: "E-502",
        building: "E",
        area: 90.2,
        vehicleCount: 2,
        vehicleType: "both",
        note: "Căn hộ nhập từ Excel",
      },
    ];

    importApartments(excelData);
    toast(`Đã nhập ${excelData.length} căn hộ từ file Excel`);
  };

  return (
    <>
      <div className="space-y-4 px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Hướng dẫn</h3>
            <Button
              variant="outline"
              className="border-blue text-blue hover:text-blue"
            >
              <FileUp />
              Tải file Excel mẫu
            </Button>
          </div>
          <ol className="list-decimal list-inside space-y-2 p-4 border">
            <li>Tải file mẫu Excel</li>
            <li>Nhập dữ liệu vào file mẫu</li>
            <li>Chọn file và nhấn Đọc file Excel</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium">Tải file lên</h3>
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <p className="mb-2">
              Kéo và thả file vào đây hoặc nhấn Chọn file để tải lên
            </p>
            <p className="text-sm text-muted-foreground">
              File phải có định dạng Excel
            </p>
            <Button
              variant="outline"
              className="mt-4 border-blue text-blue hover:text-blue"
            >
              <Plus />
              Chọn file
            </Button>
          </div>
        </div>

        <div className="space-y-4 flex flex-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
          </div>
          <Button type="button" onClick={handleImport}>
            Đọc file
          </Button>
        </div>
      </div>
      <SheetFooter className="flex-row justify-center">
        <Button type="button" variant="outline" onClick={closeDrawer}>
          Đóng
        </Button>
        <Button type="button" onClick={handleImport}>
          Đọc file
        </Button>
      </SheetFooter>
    </>
  );
}
