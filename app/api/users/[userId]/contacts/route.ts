import { proxyRequest } from "@/lib/apiProxy";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  console.log("GET contacts for user:", userId);
  return proxyRequest(`/users/${userId}/contacts`, req);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  return proxyRequest(`/users/${userId}/contacts`, req);
}
