import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// create prisma instence
const Prisma = new PrismaClient();
const JWT_SECRET: string = process.env.JWT_SECRET || "abe7651d483ec4a8b";

// Handle register requests
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, password } = body;

  try {
    const existUser = await Prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return NextResponse.json(
        { message: "email already exist!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        membership: "",
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { user: newUser, message: "registration successful", token },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
