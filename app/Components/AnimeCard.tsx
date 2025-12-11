// components/AnimeCard.tsx
import { Star, Play } from "lucide-react";
import RankBadge from "./RankBadge"
import { Anime } from "../types/anime";

interface AnimeCardProps {
  anime: Anime;
  onClick: () => void;
}

export default function AnimeCard({ anime, onClick }: AnimeCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
    >
      <div className="relative aspect-3/4">
        <img
          src={anime.images?.jpg?.image_url}
          alt={anime.title}
          className="w-full h-full object-cover"
        />

        {/* Blur effect overlay */}
        <div className="blur">
          <img
            src={anime.images?.jpg?.image_url}
            alt=""
            className="w-full h-full"
          />
        </div>

        <div className="absolute inset-0 top-2 left-2 flex gap-2">
          <div className="z-10">
            <RankBadge rank={anime.rank} />
          </div>

          {anime.score && (
            <div className="z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{anime.score.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm line-clamp-1">
              {anime.title}
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-gray-200">
                {anime.status === 'Currently Airing' ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Ongoing</span>
                  </>
                ) : anime.status === 'Finished Airing' ? (
                  <>
                    <Play className="w-3 h-3" />
                    <span className="text-[10px] sm:text-xs">{anime.episodes || '?'} eps</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-300">{anime.status}</span>
                  </>
                )}
              </div>
              {anime.episodes && anime.status === 'Finished Airing' && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs">Complete</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres?.slice(0, 2).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-xs rounded-full border border-white/20"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}