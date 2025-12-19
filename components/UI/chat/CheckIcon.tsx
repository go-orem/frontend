import { MessageStatus } from "@/types/database.types";

interface CheckIconProps {
  status?: MessageStatus;
  className?: string;
}

/**
 * Message status icon indicator
 * Shows: sent (✓), delivered (✓✓), read (✓✓ blue), queued (⏱️)
 */
export function CheckIcon({ status, className = "" }: CheckIconProps) {
  const iconClassName = `${className}`;

  if (status === "sent") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#aaa"
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-label="Message sent"
      >
        <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.42z" />
      </svg>
    );
  }

  if (status === "delivered") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#aaa"
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-label="Message delivered"
      >
        <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.42z" />
        <path d="M17 16.17l-3.88-3.88L12 13.41l5 5 7-7-1.41-1.42z" />
      </svg>
    );
  }

  if (status === "read") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#4fc3f7"
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-label="Message read"
      >
        <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.42z" />
        <path d="M17 16.17l-3.88-3.88L12 13.41l5 5 7-7-1.41-1.42z" />
      </svg>
    );
  }

  if (status === "queued") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#999"
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-label="Message queued"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 6v6l4 2.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return null;
}
