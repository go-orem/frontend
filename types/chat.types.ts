import {
  Message,
  MessageStatus,
  MessageAttachment,
} from "@/types/database.types";

/**
 * UI-friendly message type untuk display
 * Wraps Message dan tambah frontend-specific fields
 */
export interface UIMessage {
  // Inherit semua dari Message
  id: string;
  conversation_id: string;
  sender_user_id: string;
  cipher_text: string | number[] | null; // ✅ Allow null
  nonce: string | number[] | null; // ✅ Allow null
  tag: string | number[] | null; // ✅ Allow null
  encryption_algo: string;
  message_status: MessageStatus;
  reply_to_message_id: string | null;
  blockchain_hash: string | null;
  blockchain_tx_id: string | null;
  blockchain_chain: string | null;
  created_at: string;
  updated_at: string;

  // Frontend-specific fields
  status?: MessageStatus; // alias untuk message_status
  client_id?: string; // untuk optimistic updates
  is_sending?: boolean; // untuk optimistic state
  sender_name?: string;
  sender_avatar?: string;
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
  cipher_text: string | number[];
  nonce: string | number[];
  tag: string | number[] | null; // ✅ Allow null
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
