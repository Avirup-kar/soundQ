"use client";
import { useEffect, useState } from "react";
import StreamView from "../components/StreamView";

export default function Dashboard() {

   const [creatorId, setCreatorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch("/api/streams/getuserId");
        const data = await res.json();

        if (data?.creatorId) {
          setCreatorId(data.creatorId);
        } else {
          console.error("No creatorId found in session");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchCreator();
  }, []);

  if (!creatorId) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading your dashboard...
      </div>
    );
  }

  return <StreamView creatorId={creatorId} PlayVideo={true} />;
}
