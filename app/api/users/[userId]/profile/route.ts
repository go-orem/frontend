import { proxyRequest } from "@/lib/apiProxy";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  return proxyRequest(`/users/${userId}/profile`, req);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  return proxyRequest(`/users/${userId}/profile`, req);
}
