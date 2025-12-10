"use client";

import { MainContent } from "@/components/layout";
import { useConversationContext } from "@/context/ConversationContext";
import { useConversations } from "@/hooks/useConversations";
import { getErrorMessage, runEffectAsync } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ChannelDetailPage() {
  const { channelId } = useParams() as { channelId: string };
  const { messages } = useConversationContext();
  const { loadMessages } = useConversations();
  console.log("Channel ID:", channelId);
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

  return <MainContent />;
}
