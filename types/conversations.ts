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
