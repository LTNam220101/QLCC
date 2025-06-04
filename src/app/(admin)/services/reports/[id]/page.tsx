"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReportDetail } from "@/components/report/report-detail";
import { Edit } from "lucide-react";
import PageHeader from "@/components/common/page-header";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { useReport } from "@/lib/tanstack-query/reports/queries";

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { id } = use(params);
  const { data: report } = useReport(id);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Chi tiết phản ánh
            {report?.data && (
              <Badge
                variant={
                  report?.data?.status === 1
                    ? "green_outline"
                    : "destructive_outline"
                }
                className="ml-3"
              >
                {report?.data?.status === 1
                  ? "Đang hoạt động"
                  : "Đã khóa"}
              </Badge>
            )}
          </>
        }
        backUrl="/services/reports"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/services/reports/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>
      <ReportDetail reportId={id} />
    </div>
  );
}
