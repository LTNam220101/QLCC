import type { Metadata } from "next";
import { ReportForm } from "@/components/report/report-form";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Thêm mới Report",
  description: "Thêm mới report cho tòa nhà",
};

export default function AddReportPage() {
  return (
    <div>
      <PageHeader
        title={"Thêm mới phản ánh"}
        backUrl={`/services/reports`}
      />
      <ReportForm />
    </div>
  );
}
