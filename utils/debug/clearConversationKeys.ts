export function clearAllConversationKeys() {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("orem_conv_key_")) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
    console.log("🗑️ Removed key:", key);
  });

  console.log(`✅ Cleared ${keysToRemove.length} conversation keys`);

  // Reload page to re-fetch keys
  window.location.reload();
}

// Usage in browser console:
// import { clearAllConversationKeys } from '@/utils/debug/clearConversationKeys';
// clearAllConversationKeys();
