"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import StatusBadge from "@/components/common/status-badge";
import PageHeader from "@/components/common/page-header";

// Dữ liệu mẫu cho các tòa nhà
const buildings = [
  { id: "A", name: "Tòa nhà A" },
  { id: "B", name: "Tòa nhà B" },
  { id: "C", name: "Tòa nhà C" },
  { id: "D", name: "Tòa nhà D" },
];

// Dữ liệu mẫu cho các căn hộ
const apartments = [
  { id: "A-101", name: "A-101", buildingId: "A" },
  { id: "A-102", name: "A-102", buildingId: "A" },
  { id: "A-201", name: "A-201", buildingId: "A" },
  { id: "B-101", name: "B-101", buildingId: "B" },
  { id: "B-102", name: "B-102", buildingId: "B" },
  { id: "C-101", name: "C-101", buildingId: "C" },
  { id: "D-101", name: "D-101", buildingId: "D" },
];

// Dữ liệu mẫu cho các vai trò
const roles = [
  { id: "owner", name: "Chủ hộ" },
  { id: "tenant", name: "Người thuê" },
  { id: "family", name: "Thành viên gia đình" },
  { id: "guest", name: "Khách" },
];

// Schema xác thực form
const residentFormSchema = z.object({
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  birthDate: z.date({
    required_error: "Ngày sinh là bắt buộc",
  }),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  idNumber: z.string().min(1, "Số CMND/CCCD/Hộ chiếu là bắt buộc"),
  idIssueDate: z.date({
    required_error: "Ngày cấp CMND/CCCD/Hộ chiếu là bắt buộc",
  }),
  idIssuePlace: z.string().min(1, "Nơi cấp CMND/CCCD/Hộ chiếu là bắt buộc"),
  building: z.string().min(1, "Tòa nhà là bắt buộc"),
  apartment: z.string().min(1, "Căn hộ là bắt buộc"),
  role: z.string().min(1, "Vai trò là bắt buộc"),
  gender: z.string().optional(),
  moveInDate: z.date().optional(),
});

type ResidentFormValues = z.infer<typeof residentFormSchema>;

export default function AddResidentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Lấy danh sách căn hộ theo tòa nhà
  const [filteredApartments, setFilteredApartments] = useState(apartments);

  // Form
  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(residentFormSchema),
    defaultValues: {
      phone: "",
      name: "",
      email: "",
      idNumber: "",
      idIssuePlace: "",
      building: "",
      apartment: "",
      role: "",
      gender: "",
    },
  });

  // Theo dõi thay đổi tòa nhà để lọc căn hộ
  const watchBuilding = form.watch("building");

  useEffect(() => {
    if (watchBuilding) {
      setFilteredApartments(
        apartments.filter((apt) => apt.buildingId === watchBuilding)
      );
    } else {
      setFilteredApartments(apartments);
    }
  }, [watchBuilding]);

  const onSubmit = async (data: ResidentFormValues) => {
    setSaving(true);

    try {
      // Giả lập API call để thêm cư dân mới
      console.log("Adding new resident with data:", data);

      // Giả lập delay xử lý
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hiển thị thông báo thành công
      toast("Cư dân mới đã được thêm vào hệ thống");

      // Chuyển hướng về trang danh sách
      router.push("/residents");
    } catch (error) {
      console.error("Error adding resident:", error);
      toast("Có lỗi xảy ra khi thêm cư dân mới");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={<>Thêm mới cư dân</>}
        backUrl={`/building-infomation/residents`}
      >
        <Button
          className="flex items-center my-[10px] rounded-md"
          onClick={form.handleSubmit(onSubmit)}
          disabled={saving}
        >
          <Check className="size-4" />
          Lưu
        </Button>
      </PageHeader>

      <Form {...form}>
        <form id="resident-form" className="space-y-4 my-[30px]">
          <h2 className="font-bold">Thông tin chung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Họ và tên
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
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Ngày sinh
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: vi })
                            : null}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Số CMND/CCCD/Hộ chiếu
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
              name="idIssueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Ngày cấp CMND/CCCD/Hộ chiếu
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: vi })
                            : null}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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

            <FormField
              control={form.control}
              name="idIssuePlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Nơi cấp CMND/CCCD/Hộ chiếu
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div />

            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Tòa nhà
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Căn hộ
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!watchBuilding}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredApartments.map((apartment) => (
                        <SelectItem key={apartment.id} value={apartment.id}>
                          {apartment.name}
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                    Vai trò
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div />
          </div>
          <h2 className="font-bold">Thông tin khác</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
            <FormField
              control={form.control}
              name="moveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày chuyển đến</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
