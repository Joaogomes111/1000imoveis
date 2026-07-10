import { NextRequest, NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { uploadSupabaseImage } from "@/lib/supabase-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const folder = String(formData.get("folder") || "uploads");
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);

  if (!files.length) {
    return NextResponse.json({ message: "Nenhum arquivo enviado." }, { status: 400 });
  }

  try {
    const urls = await Promise.all(files.map((file) => uploadSupabaseImage(file, folder)));
    return NextResponse.json({ urls });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Não foi possível enviar o arquivo." }, { status: 500 });
  }
}
