import { ConversationType } from "./database.types";

export interface ConversationsWithMemberBody {
  conversation: {
    conversation_type: ConversationType;
    is_public: boolean;
    name: string;
    profile_url?: string | null;
  };
  members: Array<{
    user_id: string;
    role: "admin" | "member";
  }>;
}

export type FullChatProps = {
  id: number;
  name: string;
  avatar?: string;
  time: string;
  message: string;
  sender?: "me" | "other";
  status?: "sent" | "delivered" | "read";
};
