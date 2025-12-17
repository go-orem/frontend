"use client";

import { MainContent } from "@/components/layout";
import { useConversationContext } from "@/context/ConversationContext";
import { useAuth, useConversations } from "@/hooks";
import { getErrorMessage, runEffectAsync } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ChannelDetailPage() {
  const { channelId } = useParams() as { channelId: string };
  const { messages, loading: loadingMsg } = useConversationContext();
  const { loadMessages } = useConversations();
  const { isAuthenticated, loading } = useAuth();

  // initial load sekali saja
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    runEffectAsync(async () => {
      try {
        await loadMessages(channelId, { skipIfCached: true });
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }, [channelId, isAuthenticated, loading]);

  useEffect(() => {
    if (loadingMsg) return;
    console.log("Messages updated:", messages);
  }, [messages, channelId, loadingMsg]);

  return <MainContent />;
}
