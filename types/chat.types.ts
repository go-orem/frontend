import {
  Message,
  MessageStatus,
  MessageAttachment,
} from "@/types/database.types";

/**
 * UI-friendly message type untuk display
 */
export interface UIMessage {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  cipher_text: string | number[] | null;
  nonce: string | number[] | null;
  tag: string | number[] | null;
  encryption_algo: string;
  message_status: MessageStatus;
  reply_to_message_id: string | null;
  blockchain_hash: string | null;
  blockchain_tx_id: string | null;
  blockchain_chain: string | null;
  created_at: string;
  updated_at: string;

  // Frontend-specific fields
  status?: MessageStatus;
  client_id?: string;
  is_sending?: boolean;
  sender_name?: string;
  sender_avatar?: string;
  sender_username?: string;
  sender_email?: string | null;
  sender_profile?: {
    user_id: string;
    public_name: string;
    avatar_url: string | null;
    bio?: string | null;
  };
  sender_user?: {
    id: string;
    username: string;
    email: string | null;
    is_active: boolean;
  };
  attachments?: MessageAttachment[];
  deleted_at?: string | null;
}

/**
 * Convert database Message to UIMessage
 */
export function toUIMessage(msg: Message): UIMessage {
  return {
    ...msg,
    status: (msg.message_status || "sent") as MessageStatus,
    // ✅ UPDATED: Extract from sender_user first, fallback to profile
    sender_username: msg.sender_user?.username || undefined,
    sender_email: msg.sender_user?.email || undefined,
    sender_name:
      msg.sender_profile?.public_name || msg.sender_user?.username || "Unknown",
    sender_avatar: msg.sender_profile?.avatar_url || undefined,
    sender_profile: msg.sender_profile
      ? {
          user_id: msg.sender_profile.user_id,
          public_name: msg.sender_profile.public_name,
          avatar_url: msg.sender_profile.avatar_url,
          bio: msg.sender_profile.bio,
        }
      : undefined,
    sender_user: msg.sender_user
      ? {
          id: msg.sender_user.id,
          username: msg.sender_user.username,
          email: msg.sender_user.email,
          is_active: msg.sender_user.is_active,
        }
      : undefined,
  };
}

/**
 * Convert multiple messages
 */
export function toUIMessages(msgs: Message[]): UIMessage[] {
  return msgs.map(toUIMessage);
}

/**
 * Create optimistic message for instant UI feedback
 */
export function createOptimisticMessage(params: {
  client_id: string;
  conversation_id: string;
  sender_user_id: string;
  cipher_text: string;
  nonce: string;
  tag: string;
  content?: string;
}): UIMessage {
  const now = new Date().toISOString();
  return {
    id: params.client_id,
    client_id: params.client_id,
    conversation_id: params.conversation_id,
    sender_user_id: params.sender_user_id,
    cipher_text: params.cipher_text,
    nonce: params.nonce,
    tag: params.tag,
    encryption_algo: "AES-256-GCM",
    message_status: "sent",
    status: "sent",
    reply_to_message_id: null,
    blockchain_hash: null,
    blockchain_tx_id: null,
    blockchain_chain: null,
    created_at: now,
    updated_at: now,
    is_sending: true,
    attachments: [],
    deleted_at: null,
  };
}
