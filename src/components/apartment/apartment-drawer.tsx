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
import {
  useApartmentStore,
  vehicleTypes,
} from "@/lib/store/use-apartment-store";
import { toast } from "sonner";
import { buildings } from "@/lib/store/use-resident-store";

// Schema xác thực form
const apartmentFormSchema = z.object({
  apartmentNumber: z.string().min(1, { message: "Số căn hộ là bắt buộc" }),
  building: z.string().min(1, { message: "Tòa nhà là bắt buộc" }),
  area: z.coerce
    .number()
    .min(0, { message: "Diện tích phải lớn hơn hoặc bằng 0" }),
  vehicleCount: z.coerce
    .number()
    .min(0, { message: "Số lượng phương tiện phải lớn hơn hoặc bằng 0" }),
  vehicleType: z.string().optional(),
  note: z.string().optional(),
});

type ApartmentFormValues = z.infer<typeof apartmentFormSchema>;

export function ApartmentDrawer() {
  const {
    drawerOpen,
    drawerType,
    selectedApartment,
    closeDrawer,
    addApartment,
    updateApartment,
  } = useApartmentStore();

  // Form
  const form = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: {
      apartmentNumber: "",
      building: "",
      area: 0,
      vehicleCount: 0,
      vehicleType: "",
      note: "",
    },
  });

  // Cập nhật giá trị mặc định khi selectedApartment thay đổi
  useEffect(() => {
    if (selectedApartment && drawerType === "edit") {
      form.reset({
        apartmentNumber: selectedApartment.apartmentNumber,
        building: selectedApartment.building,
        area: selectedApartment.area,
        vehicleCount: selectedApartment.vehicleCount,
        vehicleType: selectedApartment.vehicleType || "",
        note: selectedApartment.note || "",
      });
    } else if (drawerType === "add") {
      form.reset({
        apartmentNumber: "",
        building: "",
        area: 0,
        vehicleCount: 0,
        vehicleType: "",
        note: "",
      });
    }
  }, [selectedApartment, drawerType, form]);

  // Xử lý submit form
  const onSubmit = (data: ApartmentFormValues) => {
    if (drawerType === "add") {
      addApartment(data);
      toast("Căn hộ đã được thêm vào hệ thống");
    } else if (drawerType === "edit" && selectedApartment) {
      updateApartment(selectedApartment.id, data);
      toast("Thông tin căn hộ đã được cập nhật");
    }
    form.reset();
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
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{drawerTitle}</SheetTitle>
        </SheetHeader>

        {(drawerType === "add" || drawerType === "edit") && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-6"
            >
              <FormField
                control={form.control}
                name="apartmentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số căn hộ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số căn hộ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tòa nhà</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tòa nhà" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildings.map((building) => (
                          <SelectItem key={building.id} value={building.id}>
                            {building.name}
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
                    <FormLabel>Diện tích (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng phương tiện</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại phương tiện</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại phương tiện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
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
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <Button type="button" variant="outline" onClick={closeDrawer}>
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </SheetFooter>
            </form>
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
    <div className="space-y-6 py-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hướng dẫn</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Tải file mẫu Excel</li>
          <li>Nhập dữ liệu vào file mẫu</li>
          <li>Chọn file và nhấn Đọc file Excel</li>
        </ol>

        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-file-spreadsheet mr-2"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h2" />
            <path d="M8 17h2" />
            <path d="M14 13h2" />
            <path d="M14 17h2" />
          </svg>
          Tải file Excel mẫu
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tải file lên</h3>
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <p className="mb-2">
            Kéo và thả file vào đây hoặc nhấn Chọn file để tải lên
          </p>
          <p className="text-sm text-muted-foreground">
            File phải có định dạng Excel
          </p>
          <Button variant="outline" className="mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-upload mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Chọn file
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thông tin căn hộ</h3>
        <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
      </div>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={closeDrawer}>
          Đóng
        </Button>
        <Button type="button" onClick={handleImport}>
          Đọc file
        </Button>
      </SheetFooter>
    </div>
  );
}
