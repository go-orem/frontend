import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyRequest(`/tags/${id}`, req);
}
