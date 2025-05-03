import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationFilters } from "@/components/notification/notification-filters";
import { NotificationTable } from "@/components/notification/notification-table";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Quản lý Notification",
  description: "Quản lý danh sách notification của tòa nhà",
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Quản lý thông báo">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/boards/notifications/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-6" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>

      <NotificationFilters />

      <NotificationTable />
    </div>
  );
}
