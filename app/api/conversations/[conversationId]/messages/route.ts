import { proxyRequest } from "@/lib/apiProxy";

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  const params = await context.params;
  return proxyRequest(`/conversations/${params.conversationId}/messages`, req);
}
