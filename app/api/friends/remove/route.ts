import { proxyRequest } from "@/lib/apiProxy";

export async function POST(req: Request) {
  return proxyRequest("/friends/remove", req);
}
