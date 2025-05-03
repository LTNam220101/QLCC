import type { Metadata } from "next";
import { NewsForm } from "@/components/news/news-form";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Thêm mới bảng tin",
  description: "Thêm mới bảng tin cho tòa nhà",
};

export default function AddNewsPage() {
  return (
    <div>
      <PageHeader title={"Thêm mới bảng tin"} backUrl={`/boards/news`} />
      <NewsForm />
    </div>
  );
}
