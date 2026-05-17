import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const data = await req.json();
    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        duration: data.duration || 60,
        clientName: data.clientName || null,
        phone: data.phone || null,
        notes: data.notes || null,
        userId: data.userId,
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
