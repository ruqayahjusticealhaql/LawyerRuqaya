export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (token) {
    await signOut(token);
    cookieStore.delete("auth-token");
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}
