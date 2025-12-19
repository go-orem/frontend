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
    <div
      className="flex space-x-1 px-2 py-1.5 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 z-20" // ✅ ADD: z-20, better styling
      onClick={(e) => e.stopPropagation()} // ✅ Prevent event bubbling
    >
      {/* Reactions */}
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          className="text-white transition text-lg cursor-pointer hover:scale-125 active:scale-95 p-1 rounded hover:bg-white/10" // ✅ ADD: padding & bg
          title={`React with ${emoji}`}
          type="button"
        >
          {emoji}
        </button>
      ))}

      {/* Delete (own messages only) */}
      {isMe && (
        <button
          onClick={handleDelete}
          className="text-red-400 transition text-lg cursor-pointer hover:scale-125 active:scale-95 ml-1 pl-1.5 border-l border-gray-600 p-1 rounded hover:bg-red-950/30" // ✅ Better styling
          title="Delete message"
          type="button"
        >
          🗑️
        </button>
      )}

      {/* Settings / More Options */}
      <button
        onClick={handleSettings}
        className="text-white transition text-lg cursor-pointer hover:scale-125 active:scale-95 p-1 rounded hover:bg-white/10" // ✅ Better styling
        title="Message options"
        type="button"
      >
        ⚙️
      </button>
    </div>
  );
}
