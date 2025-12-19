import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await context.params;
  return proxyRequest(`/friends/requests/${requestId}/reject`, req);
}
