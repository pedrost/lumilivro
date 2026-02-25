import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const archived = searchParams.get("archived") === "true";

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where: { archived },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count({ where: { archived } }),
  ]);

  return NextResponse.json({
    contacts,
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}
