import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

const ytRegex = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
   creatorId: z.string(),
   url: z.string()
})

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(ytRegex);

    if (!isYt) {
      return NextResponse.json(
        { message: "Wrong URL format" },
        { status: 400 }
      );
    }

    const MAX_QUEUE_LEN = 20;
    const streams = await prismaClient.stream.count({
      where: { userId: data.creatorId },
    });

    if (streams >= MAX_QUEUE_LEN) {
      return NextResponse.json({
        message: "You can't add more than 20 songs",
      }, { status: 400 });
    }

    const extractedId = data.url.split("?v=")[1];
    if (!extractedId) {
      return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 });
    }

    // Fetch video details safely
    let videores;
    try {
      videores = await youtubesearchapi.GetVideoDetails(extractedId);
    } catch (err) {
      console.error("YouTube API failed:", err);
      return NextResponse.json({
        message: "Failed to fetch YouTube video details",
        error: err instanceof Error ? err.message : String(err),
      }, { status: 500 });
    }

    // Safe thumbnail handling with fallback
    const getThumbnail = videores?.thumbnail?.thumbnails ?? [
      { url: "https://cdn.pixabay.com/photo/2020/10/05/10/51/cat-5628953_1280.jpg", width: 1280 },
    ];
    getThumbnail.sort((a: {width: number}, b: {width: number}) => (a.width < b.width ? -1 : 1));

    const smallImg =
      getThumbnail.length > 1
        ? getThumbnail[getThumbnail.length - 2].url
        : getThumbnail[getThumbnail.length - 1].url;

    const bigImg = getThumbnail[getThumbnail.length - 1].url;

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: videores.title ?? "Can't find",
        smallImg,
        bigImg,
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (e) {
    console.error("STREAM POST ERROR:", e);
    return NextResponse.json({
      message: "Error while adding a stream",
      error: e instanceof Error ? e.message : String(e),
    }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

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
        

    if(!creatorId){
        return NextResponse.json({
            message: "creatorId is required"
        },{
            status: 411
        })
    }

     const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
            where: {
                userId: creatorId,
                played: false
            },
        include:{
              _count: {
                 select: {
                   upvotes: true
           }},
            upvotes:{
              where: {
                   userId: user.id ?? ""
              }} 
        }
        }), prismaClient.currentStream.findFirst({
            where: {
                userId: creatorId ?? ""
            },
        include: {
            stream: true
        }
        })])
    
        return NextResponse.json({
            streams: streams.map(({_count, ...rest}) => ({
                ...rest,
                upvotes: _count.upvotes,
                haveUpvoted: rest.upvotes.length ? true : false
            })),
            activeStream
        })
}
