export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnnouncements, saveAnnouncement } from "@/lib/cms";
import { getSession, hasRole } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getAnnouncements());
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const body = await req.json();
  return NextResponse.json(saveAnnouncement(body));
}
