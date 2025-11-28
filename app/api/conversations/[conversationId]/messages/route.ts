import { proxyRequest } from "@/lib/apiProxy";

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  return proxyRequest(`/conversations/${params.conversationId}/messages`, req);
}
