import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const allBatch = await prisma.bATCH_DATA.findMany();
  return NextResponse.json({ allBatch });
}
