import { proxyRequest } from "@/lib/apiProxy";

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  return proxyRequest(`/conversations/${params.conversationId}/members`, req);
}
