import { NextResponse } from "next/server";
import sql from "mssql";

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: '192.168.0.121',
  port: 49125,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

export async function GET(request) {
  await sql.connect(sqlConfig);

  const { searchParams } = new URL(request.url);
  const result = await sql.query`SELECT COUNT(*) as count FROM batch_data`;
  const totalPages = Math.ceil(result.recordset[0].count / 5);
  let pageNumber = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  if (pageNumber > totalPages) {
    pageNumber = totalPages;
  }

  const skip = (pageNumber - 1) * 5;

  const query = search != "" ? `WHERE WTDose = '${search}'` : "";

  const req = new sql.Request();
  
  const results = await req.query(`SELECT * FROM batch_data ${query} ORDER BY TimeStamp DESC OFFSET ${skip} ROWS FETCH NEXT 5 ROWS ONLY`)

  const latest = await sql.query`
  SELECT * FROM batch_data 
  ORDER BY TimeStamp DESC
  OFFSET 0 ROWS 
  FETCH NEXT 3 ROWS ONLY
  `;

  let allBatch = results.recordset

  return NextResponse.json({ allBatch, count: totalPages, latest: latest.recordset[0] });
}
