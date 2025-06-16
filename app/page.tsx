import Header from "./components/Header";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";

async function getVideos(): Promise<IVideo[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/video`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // optional: disables caching
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function Home() {
  const videos = await getVideos();
  return (
    <>
      <Header />
      <VideoFeed videos={videos} />
    </>
  );
}
