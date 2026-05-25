export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { updateBlogPost, deleteBlogPost } from "@/lib/cms";
import { getSession, hasRole } from "@/lib/auth";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await context.params;
  const body = await req.json();
  await updateBlogPost(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await context.params;
  await deleteBlogPost(id);
  return NextResponse.json({ ok: true });
}
