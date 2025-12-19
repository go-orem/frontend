import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await context.params;
  return proxyRequest(`/messages/${messageId}/reactions`, req);
}
