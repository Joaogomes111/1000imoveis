import { NextRequest, NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { getContent, saveContent } from "@/lib/content-store";
import type { SiteContent } from "@/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ authenticated: false });
  }

  const content = await getContent();
  return NextResponse.json({ authenticated: true, content });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const content = (await request.json()) as SiteContent;
    const savedContent = await saveContent(content);
    return NextResponse.json(savedContent);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "NÃ£o foi possÃ­vel salvar.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
