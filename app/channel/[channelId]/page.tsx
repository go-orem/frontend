"use client";

import { MainContent } from "@/components/layout";
import { useParams } from "next/navigation";

export default function ChannelDetailPage() {
  const { channelId } = useParams() as { channelId: string };

  if (!channelId) {
    return <div>Channel ID not found</div>;
  }

  return <MainContent channelId={channelId} />;
}
