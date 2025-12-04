import { proxyRequest } from "@/lib/apiProxy";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  return proxyRequest(`/tags/${params.id}`, req);
}
