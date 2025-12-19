import { proxyRequest } from "@/lib/apiProxy";

export async function GET(req: Request) {
  return proxyRequest("/friends/requests", req);
}

export async function POST(req: Request) {
  return proxyRequest("/friends/requests", req);
}
