import { useModal } from "@/context";

interface MessageActionsProps {
  messageId: string;
  isMe: boolean;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮"];

/**
 * Action buttons untuk message (reactions, delete, settings)
 * Shows pada hover
 */
export function MessageActions({
  messageId,
  isMe,
  onDelete,
  onReact,
}: MessageActionsProps) {
  const { openModal } = useModal();

  const handleReact = (emoji: string) => {
    onReact?.(messageId, emoji);
  };

  const handleDelete = () => {
    if (confirm("Delete message?")) {
      onDelete?.(messageId);
    }
  };

  const handleSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal(messageId, e.currentTarget);
  };

  return (
    <div className="absolute flex space-x-1 px-2 py-1 top-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-lg z-10">
      {/* Reactions */}
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          className="text-white transition text-lg cursor-pointer hover:scale-110 active:scale-95"
          title={`React with ${emoji}`}
          type="button"
        >
          {emoji}
        </button>
      ))}

      {/* Delete (only for own messages) */}
      {isMe && (
        <button
          onClick={handleDelete}
          className="text-white transition text-lg cursor-pointer hover:scale-110 active:scale-95 ml-1 pl-1 border-l border-gray-600"
          title="Delete message"
          type="button"
        >
          🗑️
        </button>
      )}

      {/* Settings / More Options */}
      <button
        onClick={handleSettings}
        className="text-white transition text-lg cursor-pointer hover:scale-110 active:scale-95"
        title="Message options"
        type="button"
      >
        ⚙️
      </button>
    </div>
  );
}
