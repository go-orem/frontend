import { proxyRequest } from "@/lib/apiProxy";

export async function PUT(req: Request) {
  return proxyRequest(`/users/keys`, req);
}
