export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/cms";
import { getSession, hasRole } from "@/lib/auth";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await props.params;
  const body = await req.json();
  await updateAnnouncement(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await props.params;
  await deleteAnnouncement(id);
  return NextResponse.json({ ok: true });
}
