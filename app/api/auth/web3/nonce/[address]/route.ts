import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ address: string }> }
) {
  const { address } = await context.params;

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/web3/nonce/${address}`,
    { method: "GET" }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
