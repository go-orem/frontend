export function deleteCookie(name: string) {
  const isProduction =
    typeof window !== "undefined" && window.location.hostname !== "localhost";
  const domain = isProduction ? ".oremchat.com" : undefined;

  // Delete dengan berbagai kombinasi untuk pastikan terhapus
  const attempts = [
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`,
    `${name}=; max-age=0; path=/;`,
    `${name}=; max-age=0; path=/; domain=${domain};`,
  ];

  attempts.forEach((cookie) => {
    document.cookie = cookie;
  });
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
