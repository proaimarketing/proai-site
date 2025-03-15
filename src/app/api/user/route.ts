import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// create prisma instence
const Prisma = new PrismaClient();

// Handle all user get request
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    const users = await Prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { create_at: "desc" },
    });
    const totalUsers = await Prisma.user.count();
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
      { users, currentPage: page, totalPages },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
