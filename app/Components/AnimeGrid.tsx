// components/AnimeGrid.tsx
import AnimeCard from "./AnimeCard";
import { Anime } from "../types/anime";

interface AnimeGridProps {
  animes: Anime[];
  title?: string;
  onAnimeClick: (anime: Anime) => void;
  clearSearch?: () => void;
  showClearButton?: boolean;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export default function AnimeGrid({
  animes,
  title,
  onAnimeClick,
  clearSearch,
  showClearButton = false,
  columns = { base: 2, sm: 3, md: 4 },
}: AnimeGridProps) {
  const getGridClasses = () => {
    const base = columns.base ? `grid-cols-${columns.base}` : 'grid-cols-2';
    const sm = columns.sm ? `sm:grid-cols-${columns.sm}` : 'sm:grid-cols-3';
    const md = columns.md ? `md:grid-cols-${columns.md}` : 'md:grid-cols-4';
    const lg = columns.lg ? `lg:grid-cols-${columns.lg}` : '';
    
    return `grid ${base} ${sm} ${md} ${lg} gap-4`;
  };

  return (
    <div>
      {(title || showClearButton) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="text-lg font-bold text-white">{title}</h2>
          )}
          {showClearButton && clearSearch && (
            <button
              onClick={clearSearch}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className={getGridClasses()}>
        {animes.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            anime={anime}
            onClick={() => onAnimeClick(anime)}
          />
        ))}
      </div>
    </div>
  );
}