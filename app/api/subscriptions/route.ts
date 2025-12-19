import { proxyRequest } from "@/lib/apiProxy";

export async function POST(req: Request) {
  return proxyRequest("/subscriptions", req);
}

export async function GET(req: Request) {
  return proxyRequest("/subscriptions/active", req);
}
