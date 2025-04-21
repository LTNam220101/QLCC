import type { Metadata } from "next";
import { HotlineForm } from "@/components/hotline/hotline-form";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Thêm mới Hotline",
  description: "Thêm mới hotline cho tòa nhà",
};

export default function AddHotlinePage() {
  return (
    <div>
      <PageHeader title={"Thêm mới hotline"} backUrl={`/services/hotlines`} />
      <HotlineForm />
    </div>
  );
}
