import { proxyRequest } from "@/lib/apiProxy";

export async function GET(req: Request) {
  return proxyRequest("/tags", req);
}

export async function POST(req: Request) {
  return proxyRequest("/tags", req);
}
