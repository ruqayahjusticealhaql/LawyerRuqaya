export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { updateSection, deleteSection } from "@/lib/cms";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  updateSection(params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deleteSection(params.id);
  return NextResponse.json({ ok: true });
}
