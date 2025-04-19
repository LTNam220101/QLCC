"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, Check } from "lucide-react";
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
import PageHeader from "@/components/common/page-header";
import InfoRow from "@/components/common/info-row";
import StatusBadge from "@/components/common/status-badge";

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

// Dữ liệu mẫu cho cư dân
const initialResidents = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    building: "A",
    apartment: "A-101",
    role: "owner",
    moveInDate: "2023-01-15",
    status: "active",
    email: "nguyenvana@example.com",
    idNumber: "012345678901",
    idIssueDate: "2020-01-01",
    idIssuePlace: "Hà Nội",
    gender: "Nam",
    birthDate: "1985-05-15",
    createdBy: "Admin",
    createdAt: "2023-01-10",
    updatedBy: "Admin",
    updatedAt: "2023-01-10",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    building: "A",
    apartment: "A-102",
    role: "tenant",
    moveInDate: "2023-02-20",
    status: "pending",
    email: "tranthib@example.com",
    idNumber: "012345678902",
    idIssueDate: "2019-05-10",
    idIssuePlace: "Hồ Chí Minh",
    gender: "Nữ",
    birthDate: "1990-10-20",
    createdBy: "Admin",
    createdAt: "2023-02-15",
    updatedBy: "Admin",
    updatedAt: "2023-02-15",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    building: "B",
    apartment: "B-101",
    role: "family",
    moveInDate: "2023-03-10",
    status: "inactive",
    email: "levanc@example.com",
    idNumber: "012345678903",
    idIssueDate: "2018-12-05",
    idIssuePlace: "Đà Nẵng",
    gender: "Nam",
    birthDate: "1978-03-25",
    createdBy: "Admin",
    createdAt: "2023-03-05",
    updatedBy: "Admin",
    updatedAt: "2023-03-05",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    building: "C",
    apartment: "C-101",
    role: "guest",
    moveInDate: "2023-04-05",
    status: "new",
    email: "phamthid@example.com",
    idNumber: "012345678904",
    idIssueDate: "2021-02-15",
    idIssuePlace: "Hải Phòng",
    gender: "Nữ",
    birthDate: "1995-12-10",
    createdBy: "Admin",
    createdAt: "2023-04-01",
    updatedBy: "Admin",
    updatedAt: "2023-04-01",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    building: "D",
    apartment: "D-101",
    role: "owner",
    moveInDate: "2023-05-15",
    status: "draft",
    email: "hoangvane@example.com",
    idNumber: "012345678905",
    idIssueDate: "2017-08-20",
    idIssuePlace: "Cần Thơ",
    gender: "Nam",
    birthDate: "1982-07-30",
    createdBy: "Admin",
    createdAt: "2023-05-10",
    updatedBy: "Admin",
    updatedAt: "2023-05-10",
  },
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

export default function EditResidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [resident, setResident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // Giả lập API call để lấy thông tin cư dân
    const fetchResident = async () => {
      setLoading(true);
      try {
        // Trong thực tế, đây sẽ là một API call
        const foundResident = initialResidents.find(
          (r) => r.id === Number.parseInt(id)
        );

        if (foundResident) {
          setResident(foundResident);

          // Cập nhật giá trị mặc định cho form
          form.reset({
            phone: foundResident.phone,
            name: foundResident.name,
            email: foundResident.email || "",
            idNumber: foundResident.idNumber,
            idIssuePlace: foundResident.idIssuePlace,
            building: foundResident.building,
            apartment: foundResident.apartment,
            role: foundResident.role,
            gender: foundResident.gender,
            birthDate: foundResident.birthDate
              ? new Date(foundResident.birthDate)
              : undefined,
            idIssueDate: foundResident.idIssueDate
              ? new Date(foundResident.idIssueDate)
              : undefined,
            moveInDate: foundResident.moveInDate
              ? new Date(foundResident.moveInDate)
              : undefined,
          });

          // Lọc căn hộ theo tòa nhà
          if (foundResident.building) {
            setFilteredApartments(
              apartments.filter(
                (apt) => apt.buildingId === foundResident.building
              )
            );
          }
        } else {
          // Nếu không tìm thấy, chuyển hướng về trang danh sách
          router.push("/building-infomation/residents");
        }
      } catch (error) {
        console.error("Error fetching resident:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResident();
  }, [id, router, form]);

  const onSubmit = async (data: ResidentFormValues) => {
    setSaving(true);

    try {
      // Giả lập API call để cập nhật cư dân
      console.log("Updating resident with data:", data);

      // Giả lập delay xử lý
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hiển thị thông báo thành công
      toast("Thông tin cư dân đã được cập nhật");

      // Chuyển hướng về trang chi tiết
      router.push(`/building-infomation/residents/${id}`);
    } catch (error) {
      console.error("Error updating resident:", error);
      toast("Có lỗi xảy ra khi cập nhật cư dân");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (!resident) {
    return <div className="container mx-auto p-4">Không tìm thấy cư dân</div>;
  }

  return (
    <div>
      <PageHeader
        title={
          <>
            Cập nhật cư dân
            <StatusBadge status={resident.status} className="ml-[14px]" />
          </>
        }
        backUrl={`/building-infomation/residents/${id}`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
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

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
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
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="moveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày chuyển đến</FormLabel>
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
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-bold">Thông tin khác</h2>
            <div className="grid md:grid-cols-2 gap-x-10">
              <div>
                <InfoRow label="Người tạo" value={resident.createdBy} />
                <InfoRow label="Người cập nhật" value={resident.updatedBy} />
              </div>
              <div>
                <InfoRow label="Ngày tạo" value={resident.createdAt} />
                <InfoRow label="Ngày cập nhật" value={resident.updatedAt} />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
