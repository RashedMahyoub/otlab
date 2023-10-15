import { NextResponse } from "next/server";
import sql from "mssql";

export async function GET(request) {
  await sql.connect(process.env.DATABASE_URL);

  const { searchParams } = new URL(request.url);
  const totalItems = await prisma.bATCH_DATA.count();
  const totalPages = Math.ceil(totalItems / 5);
  let pageNumber = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  if (pageNumber > totalPages) {
    pageNumber = totalPages;
  }

  const skip = (pageNumber - 1) * 5;

  const allBatch = await sql.query`select * from batch_data where WTDose like '%${search}%' offset ${skip} rows
  FETCH NEXT 5 rows only`;

  const latest = await sql.query`select * from batch_data order by TimeStamp FETCH NEXT 1 rows only`;

  return NextResponse.json({ allBatch, count: totalPages, latest: latest[0] });
}
