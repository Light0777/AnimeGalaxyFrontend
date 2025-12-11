// components/TopAiringSection.tsx
import { Play } from "lucide-react";
import { Anime } from "../types/anime";
import TrailerPlayer from "./trailers";
import AnimeCard from "./AnimeCard";

interface TopAiringSectionProps {
  topAiringAnime: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

export default function TopAiringSection({
  topAiringAnime,
  onAnimeClick,
}: TopAiringSectionProps) {
  if (topAiringAnime.length === 0) return null;

  const topAnime = topAiringAnime[0];
  const otherAnimes = topAiringAnime.slice(1, 5);

  return (
    <div className="mb-8 md:mb-12">
      {/* Top Airing Trailer/Highlight */}
      <div className="mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {topAnime?.trailer_youtube_id ? (
            <TrailerPlayer
              youtubeId={topAnime.trailer_youtube_id}
              title={topAnime.title}
              autoPlay={true}
            />
          ) : (
            <div className="relative aspect-video bg-linear-to-br from-gray-900 to-black">
              <img
                src={topAnime?.images?.jpg?.large_image_url}
                alt={topAnime?.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">No trailer available</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* More Airing Anime Grid */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {otherAnimes.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              onClick={() => onAnimeClick(anime)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}