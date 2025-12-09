import { proxyRequest } from "@/lib/apiProxy";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams.toString();

  return proxyRequest(`/users/search?${params}`, req);
}
