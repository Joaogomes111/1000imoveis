import crypto from "node:crypto";

import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function createSessionValue() {
  const password = getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt, password);
  return `${issuedAt}.${signature}`;
}

export function attachAdminCookie(response: NextResponse, sessionValue: string) {
  response.cookies.set(ADMIN_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminRequest(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  return isValidSession(session);
}

function isValidSession(session?: string) {
  const password = getAdminPassword();
  if (!session || !password) {
    return false;
  }

  const [issuedAt, signature] = session.split(".");
  const issuedAtNumber = Number(issuedAt);

  if (!issuedAt || !signature || !Number.isFinite(issuedAtNumber)) {
    return false;
  }

  const ageSeconds = (Date.now() - issuedAtNumber) / 1000;
  if (ageSeconds > SESSION_TTL_SECONDS || ageSeconds < 0) {
    return false;
  }

  const expected = sign(issuedAt, password);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
