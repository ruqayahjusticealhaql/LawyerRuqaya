export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { updateSection, deleteSection } from "@/lib/cms";
import { getSession, hasRole } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  await updateSection(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await params;
  await deleteSection(id);
  return NextResponse.json({ ok: true });
}
