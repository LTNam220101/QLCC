"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HotlineDetail } from "@/components/hotline/hotline-detail";
import { Edit } from "lucide-react";
import PageHeader from "@/components/common/page-header";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { useHotline } from "@/lib/tanstack-query/hotlines/queries";

interface HotlineDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HotlineDetailPage({ params }: HotlineDetailPageProps) {
  const { id } = use(params);
  const { data: hotline } = useHotline(id);

  return (
    <div>
      <PageHeader
        title={
          <>
            Chi tiết Hotline
            {hotline?.data && (
              <Badge
                variant={hotline?.data?.status === 1 ? "green_outline" : "destructive_outline"}
                className="ml-3"
              >
                {hotline?.data?.status === 1 ? "Đang hoạt động" : "Đã khóa"}
              </Badge>
            )}
          </>
        }
        backUrl="/services/hotlines"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/services/hotlines/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>
      <HotlineDetail hotlineId={id} />
    </div>
  );
}
