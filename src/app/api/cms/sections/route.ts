export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSections, saveSection } from "@/lib/cms";
import { getSession, hasRole } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await getSections());
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const body = await req.json();
  return NextResponse.json(await saveSection(body));
}
