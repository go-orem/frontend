import { ConversationType } from "./database.types";

export interface ConversationsWithMemberBody {
  conversation: {
    conversation_type: ConversationType;
    is_public: boolean;
    name: string;
    profile_url?: string | null;
    cover_url?: string | null;
  };
  members: Array<{
    user_id: string;
    role: "admin" | "member";
    encrypted_conversation_key: string;
    key_algo: string;
    key_version: number;
    username?: string;
    public_name?: string;
    avatar_url?: string;
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
