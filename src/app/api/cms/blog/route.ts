export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getBlogPosts, saveBlogPost } from "@/lib/cms";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getBlogPosts());
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  return NextResponse.json(saveBlogPost(body));
}
