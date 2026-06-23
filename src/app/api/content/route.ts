import { NextResponse } from "next/server";

import { getContent } from "@/lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}
