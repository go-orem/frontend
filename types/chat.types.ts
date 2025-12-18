import {
  Message,
  MessageStatus,
  MessageAttachment,
} from "@/types/database.types";

export type UIMessage = Message & {
  client_id?: string;
  status?: MessageStatus;
  attachments: MessageAttachment[];
  deleted_at: string | null;
};

export function createOptimisticMessage(params: {
  client_id: string;
  conversation_id: string;
  sender_user_id: string;
  cipher_text: string;
  nonce: string;
  tag: string | null;
}): UIMessage {
  const now = new Date().toISOString();

  return {
    // identity
    id: params.client_id,
    client_id: params.client_id,
    conversation_id: params.conversation_id,
    sender_user_id: params.sender_user_id,

    // encryption
    cipher_text: params.cipher_text,
    nonce: params.nonce,
    tag: params.tag,
    encryption_algo: "AES-256-GCM",

    // relations
    reply_to_message_id: null,
    attachments: [],

    // blockchain (MANDATORY)
    blockchain_hash: null,
    blockchain_tx_id: null,
    blockchain_chain: null,

    created_at: now,
    updated_at: now,
    deleted_at: null,

    message_status: "queued",
  };
}
