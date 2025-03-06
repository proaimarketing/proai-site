import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

// create prisma instence
const prisma = new PrismaClient();

// create inerface type
interface Context {
  params: { id?: string };
}

// get single user by email
export async function GET(req: NextRequest, context: Context) {
  const { params } = context;
  const { id } = await params;

  try {
    const existUser = await prisma.user.findUnique({
      where: {
        email: id,
      },
    });

    if (!existUser) {
      return NextResponse.json({ message: "data not found!" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "query successful", user: existUser },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// update user by id
export async function PUT(req: Request, context: Context) {
  const { params } = context;
  const { id } = await params;
  const searchId = Number(id);
  const body = await req.json();
  const { email, password, username } = body;
  try {
    const existUser = await prisma.user.findUnique({
      where: {
        id: searchId,
      },
    });

    if (!existUser) {
      return NextResponse.json({ message: "data not found!" }, { status: 404 });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: searchId,
      },
      data: {
        email,
        password,
        username,
      },
    });

    return NextResponse.json(
      { user: updateUser, message: "update successful" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// delete user by id
export async function DELETE(req: Request, context: Context) {
  const { params } = context;
  const { id } = await params;
  const searchId = Number(id);
  try {
    const existUser = await prisma.user.findUnique({
      where: {
        id: searchId,
      },
    });

    if (!existUser) {
      return NextResponse.json({ message: "data not found!" }, { status: 404 });
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: searchId,
      },
    });
    return NextResponse.json(
      { user: deleteUser, message: "delete successful" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
