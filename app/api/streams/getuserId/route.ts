import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
  const session = await getServerSession();

  // 🔹 Find user by email from session
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
    select: {
      id: true,
    },
  });

  console.log("Found user:", user?.id);
  // 🔹 If user not found, return 401 Unauthorized
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔹 If found, return user id (creatorId)
  return NextResponse.json({
    message: "User found",
    creatorId: user.id,
  })
  }catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json(
    { message },
    { status: 403 }
  );
}
}