import { HotlineForm } from "@/components/hotline/hotline-form";
import PageHeader from "@/components/common/page-header";
import { use } from "react";

interface EditHotlinePageProps {
  params: Promise<{ id: string }>;
}

export default function EditHotlinePage({ params }: EditHotlinePageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Sửa hotline" backUrl={`/services/hotlines/${id}`}/>
      <HotlineForm hotlineId={id} isEdit />
    </div>
  );
}
