export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/cms";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  return NextResponse.json(saveSettings(body));
}
