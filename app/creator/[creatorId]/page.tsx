import StreamView from "@/app/components/StreamView";

export default async function Page({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = await params; // ✅ await here
  return <StreamView creatorId={creatorId} PlayVideo={false} />;
}
