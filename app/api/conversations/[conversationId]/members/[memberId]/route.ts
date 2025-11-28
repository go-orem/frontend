import { proxyRequest } from "@/lib/apiProxy";

export async function DELETE(
  req: Request,
  { params }: { params: { conversationId: string; memberId: string } }
) {
  return proxyRequest(
    `/conversations/${params.conversationId}/members/${params.memberId}`,
    req
  );
}
