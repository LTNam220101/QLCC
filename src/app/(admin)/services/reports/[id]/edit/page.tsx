import { ReportForm } from "@/components/report/report-form";
import PageHeader from "@/components/common/page-header";
import { use } from "react";

interface EditReportPageProps {
  params: Promise<{ id: string }>;
}

export default function EditReportPage({
  params,
}: EditReportPageProps) {
  const { id } = use(params);

  return (
    <div>
      <PageHeader title="Sửa phản ánh" backUrl={`/services/reports/${id}`} />
      <ReportForm reportId={id} isEdit />
    </div>
  );
}
