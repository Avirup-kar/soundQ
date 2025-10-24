import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod';


const upvoatSchema = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest) {
   const session = await getServerSession();
   
   const user = await prismaClient.user.findFirst({
    where: {
        email: session?.user?.email ?? ""
    }
   })
   
   if(!user){
    return NextResponse.json({
        message: "Unauthorized"
    },{
        status: 401
    })
   }

   try {
    const data = upvoatSchema.parse(await req.json());
    if(!data.streamId){
        console.log("No streamId provided");
    }
   await prismaClient.upvote.create({
        data: {
            userId: user.id,
            streamId: data.streamId
        }
    })

    return NextResponse.json({
        message: "Upvoted"
     })
   }catch (error: unknown) {
  let message = "Something went wrong white Upvoted";

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json(
    { message },
    { status: 403 }
  );
}
}