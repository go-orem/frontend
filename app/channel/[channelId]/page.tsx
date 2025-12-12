"use client";

import { MainContent } from "@/components/layout";
import { useConversationContext } from "@/context/ConversationContext";
import { useConversationDetail, useConversations } from "@/hooks";
import { getErrorMessage, runEffectAsync } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ChannelDetailPage() {
  const { channelId } = useParams() as { channelId: string };
  const { messages } = useConversationContext();
  const { loadMessages } = useConversations();
  const { detail, loading, error } = useConversationDetail(channelId);

  useEffect(() => {
    runEffectAsync(async () => {
      try {
        await loadMessages(channelId);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }, []);

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  console.log("Conversation Detail:", detail);

  return <MainContent />;
}
