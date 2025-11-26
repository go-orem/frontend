"use client";

import { MainContent } from "@/components/layout";
import { useParams } from "next/navigation";

export default function ChannelDetailPage() {
  const { channelId } = useParams();

  return <MainContent />;
}
