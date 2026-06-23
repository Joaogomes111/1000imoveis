import { NextRequest, NextResponse } from "next/server";

import { attachAdminCookie, createSessionValue, getAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  const expectedPassword = getAdminPassword();

  if (!expectedPassword) {
    return NextResponse.json({ message: "Configure ADMIN_PASSWORD no ambiente." }, { status: 500 });
  }

  if (!password || password !== expectedPassword) {
    return NextResponse.json({ message: "Senha inválida." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  attachAdminCookie(response, createSessionValue());
  return response;
}
