"use client";

import { useState, useEffect, useRef } from "react";
import {  Play, Share2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import YouTubePlayer from 'youtube-player';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface QueueItem {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}

export default function StreamView({creatorId, PlayVideo = false}: {creatorId: string, PlayVideo: boolean}) {
  const session = useSession();
  const router = useRouter();
  const REFRESH_INTERVAL_MS = 10 * 1000;
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<QueueItem| null>(null)
  const [videoLink, setVideoLink] = useState("");
  const [loder, setLoder] = useState(false)
  const [playloder, setPlayLoder] = useState(false)
  const videoPlayerRef = useRef<HTMLDivElement>(null)


  const SignOut = async () => {
  if (session?.data?.user) {
    await signOut({ redirect: false });
    router.push("/");
  }
};
  

  // 🔁 Fetch all streams
  async function refreshStreams() {
    try {
      const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setQueue(
  (data.streams as  QueueItem[])
    .sort((a, b) => b.upvotes - a.upvotes) // descending order
    .map((stream) => ({
      id: stream.id,
      type: stream.type,
      url: stream.url,
      extractedId: stream.extractedId,
      title: stream.title,
      smallImg: stream.smallImg,
      bigImg: stream.bigImg,
      active: stream.active,
      userId: stream.userId,
      upvotes: stream.upvotes,
      haveUpvoted: stream.haveUpvoted,
    }))
);
      setCurrentVideoId(video =>{
        if(video?.id === data.activeStream?.stream?.id) {
        return video;
        }
       return data.activeStream.stream
   }); 
    } catch (err) {
      console.error("Failed to fetch streams:", err);
    }
  }

  useEffect(() => {
    refreshStreams();
    setInterval(() => {
          refreshStreams();
    }, REFRESH_INTERVAL_MS);
  }, []);


  useEffect(() => {
    if(!videoPlayerRef.current) return;
   const player = YouTubePlayer(videoPlayerRef.current);

   // 'loadVideoById' is queued until the player is ready to receive API calls.
  player.loadVideoById(currentVideoId?.extractedId || "");

   // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
  player.playVideo();

  // @ts-expect-error Event type from youtube-player
  function eventHandler(event) {
    console.log(event.data);
    if(event.data === 0){
      handlePlayNext();
    }
  }

  player.on('stateChange', eventHandler);

    return () => {
    player.destroy();
    }
  }, [currentVideoId, videoPlayerRef]);


  // ➕ Add new video
  const handleAddVideo = async () => {
    if (!videoLink) return;
    setLoder(true);
    try {
      const res = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creatorId,
          url: videoLink,
        }),
      });

      const data = await res.json();
        setQueue((prev) => [...prev, data]);
      setVideoLink("");
      setLoder(false);
      // setPreviewData(null);
    } catch (error) {
      alert(error);
    }
  };

  //share the app
const handleShare = () => {
  const shareableLink = `${window.location.origin}/creator/${creatorId}`;

   navigator.clipboard.writeText(shareableLink)
   alert("Link copied to share")
   toast.success("Link copied to share")
};


  // 👍 Handle upvote
  const handleVote = async (id: string, haveUpvoted: boolean) => {
  try {
    const endpoint = haveUpvoted
      ? "/api/streams/downvoate"
      : "/api/streams/upvoate";

      await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ streamId: id }),
    });


      setQueue((prev) =>
        prev
          .map((item) =>
            item.id === id
              ? {
                  ...item,
                  upvotes: item.upvotes + (haveUpvoted ? -1 : 1),
                  haveUpvoted: !haveUpvoted,
                }
              : item
          )
          .sort((a, b) => b.upvotes - a.upvotes)
      );
    
  } catch (error) {
    console.error("Error voting:", error);
  }
};


  const handlePlayNext = async () => {
    if(queue.length > 0){
      try {
        setPlayLoder(true)
        const res = await fetch(`/api/streams/nextmu`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
    setCurrentVideoId(data.stream);
    setQueue(q => q.filter(x => x.id !== data.stream?.id))
      } catch (error) {
        console.error("Failed to play next video:", error);
      }
    setPlayLoder(false)
    };
    
  };

  // 🎨 UI
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

  {/* Header */}
  <header className="border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md shadow-lg">
    <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">Song Voting Queue</h1>
      <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {session.data?.user ? <button  className="bg-primary py-1.5 rounded-lg cursor-pointer px-5 hover:bg-primary/80  hover:shadow-purple-500/50" onClick={() => SignOut()}>SignOut</button> : <button  className="bg-primary py-1.5 rounded-lg cursor-pointer px-5 hover:bg-primary/90" onClick={() => signIn()}>Signin</button>}
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-center lg:flex-row gap-6">
    {/* Left Section — Fixed on large screens */}
    <div className="lg:sticky lg:top-[90px] lg:self-start lg:h-[calc(100vh-100px)] lg:overflow-y-auto w-full lg:w-[40%] space-y-6">
      {/* Video Submission */}
      <div className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 p-6 shadow-xl backdrop-blur-sm">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Paste YouTube link here"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full rounded-lg bg-slate-900/50 border border-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <button
            onClick={handleAddVideo}
            disabled={loder}
            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-purple-500/50 disabled:shadow-none"
          >
            Add to Queue
          </button>
        </div>
      </div>

      {/* Now Playing */}
      <div className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 p-6 shadow-xl backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-semibold text-white">Now Playing</h2>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-950 border border-slate-700/50 shadow-inner">
          {currentVideoId ? PlayVideo ? (
            // <iframe
            //   width="100%"
            //   height="100%"
            //   src={`https://www.youtube.com/embed/${currentVideoId?.extractedId}?autoplay=1`}
            //   title="Now Playing"
            //   frameBorder="0"
            //   allow="autoplay; "
            //   allowFullScreen
            //   className="rounded-lg"
            // />
            <div ref={videoPlayerRef} className="w-full h-full"></div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <Image
                src={currentVideoId.bigImg}
                alt="bigImage"
                width={640}      // set actual thumbnail width
                height={360}     // set actual thumbnail height
                className="rounded-lg object-cover"
              />

            </div>
          ) : 
            <div className="flex items-center justify-center h-full text-slate-400">
              No video playing
            </div>}
        </div>
        {PlayVideo && <button
          onClick={handlePlayNext}
          disabled={playloder}
          className="w-full mt-4 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-4 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          {playloder ? "Loading..." : "Play Next Song"}
        </button>}
      </div>
    </div>

    {/* Right Section — Scrollable (below on mobile) */}
    <div className="w-full lg:w-[40%] space-y-4 lg:overflow-y-auto">
      <div className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 p-6 shadow-xl backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-semibold text-white">Upcoming Songs</h2>
        <div className="space-y-3 min-h-[50px]">
          {queue.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg bg-slate-800/40 border border-slate-700/50 p-3 transition-all hover:bg-slate-800/60 hover:border-purple-500/30 shadow-md"
            >
              <Image
                src={item.smallImg || "/placeholder.svg"}
                alt={item.title}
                width={94}
                height={34} 
                className="rounded-lg object-cover border border-slate-700/50"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white line-clamp-2">
                  {item.title}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleVote(item.id, item.haveUpvoted)}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all shadow-md ${
                      item.haveUpvoted
                        ? "border-green-500/40 bg-green-500/10 hover:bg-green-500/20 hover:border-green-500/60"
                        : "border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500/60"
                    }`}
                  >
                    {item.haveUpvoted ? (
                      <ChevronDown className="h-5 w-5 text-green-400" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-purple-400" />
                    )}
                    <span
                      className={`text-xs font-bold ${
                        item.haveUpvoted
                          ? "text-green-400"
                          : "text-purple-400"
                      }`}
                    >
                      {item.upvotes}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
</div>


  );
}
