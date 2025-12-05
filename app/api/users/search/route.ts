import { proxyRequest } from "@/lib/apiProxy";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  return proxyRequest(`/users/search?q=${q}`, req);
}
