import type { SiteContent } from "@/types/content";

const SITE_CONTENT_ID = "main";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
}

function getSupabaseSecretKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "site-images";
}

export function hasSupabaseConfig() {
  return Boolean(getSupabaseUrl() && getSupabaseSecretKey());
}

export async function getSupabaseContent() {
  const supabaseUrl = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!supabaseUrl || !secretKey) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/site_content?id=eq.${SITE_CONTENT_ID}&select=content`, {
    headers: getSupabaseHeaders(secretKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase content read failed: ${response.status}`);
  }

  const rows = (await response.json()) as Array<{ content?: unknown }>;
  const content = rows[0]?.content;

  return isSiteContent(content) ? content : null;
}

export async function saveSupabaseContent(content: SiteContent) {
  const supabaseUrl = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!supabaseUrl || !secretKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/site_content?on_conflict=id`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(secretKey),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify([
      {
        id: SITE_CONTENT_ID,
        content,
        updated_at: content.updatedAt,
      },
    ]),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Supabase content save failed: ${response.status} ${errorText}`);
  }

  return content;
}

export async function uploadSupabaseImage(file: File, folder: string) {
  const supabaseUrl = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!supabaseUrl || !secretKey) {
    return fileToDataUrl(file);
  }

  const bucket = getStorageBucket();
  const filePath = buildStoragePath(file, folder);
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Supabase image upload failed: ${response.status} ${errorText}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
}

function getSupabaseHeaders(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
  };
}

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const content = value as Partial<SiteContent>;
  return Boolean(content.siteConfig && Array.isArray(content.imoveis));
}

function buildStoragePath(file: File, folder: string) {
  const safeFolder = folder
    .split("/")
    .map((part) => slugifyPathPart(part))
    .filter(Boolean)
    .join("/");
  const extension = getExtension(file);
  const randomId = crypto.randomUUID();

  return `${safeFolder || "uploads"}/${Date.now()}-${randomId}${extension}`;
}

function getExtension(file: File) {
  const nameExtension = file.name.match(/\.[a-z0-9]+$/i)?.[0];
  if (nameExtension) {
    return nameExtension.toLowerCase();
  }

  const mimeExtension = file.type.split("/")[1];
  return mimeExtension ? `.${mimeExtension}` : "";
}

function slugifyPathPart(value: string) {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
