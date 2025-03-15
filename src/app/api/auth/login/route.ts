import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// create prisma instence
const prisma = new PrismaClient();
const JWT_SECRET: string = process.env.JWT_SECRET || "abe7651d483ec4a8b";

// Handle login request
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  try {
    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 400 });
    }
    const comparePassword = await bcrypt.compare(password, existUser.password);
    if (!comparePassword) {
      return NextResponse.json(
        { message: "Password does not match!" },
        { status: 400 }
      );
    }
    const token = jwt.sign(
      { id: existUser.id, email: existUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return NextResponse.json(
      { token, user: existUser, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
