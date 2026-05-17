export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/cms";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  updateAnnouncement(params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deleteAnnouncement(params.id);
  return NextResponse.json({ ok: true });
}
