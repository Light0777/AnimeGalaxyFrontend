// components/AnimeModalContent.tsx
import { Star, Calendar } from "lucide-react";
import RankBadge from "./RankBadge";
import { Anime } from "../types/anime";

interface AnimeModalContentProps {
  anime: Anime;
}

export default function AnimeModalContent({ anime }: AnimeModalContentProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <img
          src={anime.images?.jpg?.large_image_url}
          alt={anime.title}
          className="w-full rounded-lg mb-4"
        />

        {anime.rank && (
          <div className="flex justify-center mb-4">
            <RankBadge rank={anime.rank} />
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="flex flex-wrap gap-3">
          {anime.score && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-white">{anime.score}/10</span>
            </div>
          )}
          {anime.year && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-white">{anime.year}</span>
            </div>
          )}
        </div>

        {anime.synopsis && (
          <div>
            <h3 className="font-bold mb-2 text-white">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
          </div>
        )}

        {anime.genres && anime.genres.length > 0 && (
          <div>
            <h3 className="font-bold mb-2 text-white">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}