import type { Metadata } from "next";
import { NotificationForm } from "@/components/notification/notification-form";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Thêm mới Notification",
  description: "Thêm mới thông báo cho tòa nhà",
};

export default function AddNotificationPage() {
  return (
    <div>
      <PageHeader title={"Thêm mới thông báo"} backUrl={`/boards/notifications`} />
      <NotificationForm />
    </div>
  );
}
