"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Star, Calendar, Play, TrendingUp, X, ExternalLink, Volume2 } from "lucide-react";
import TrailerPlayer from "./trailers"; // Import the custom video player

// Define TypeScript interfaces
interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
      small_image_url: string;
    };
  };
  score?: number;
  episodes?: number;
  year?: number;
  status?: string;
  rating?: string;
  rank?: number;
  popularity?: number;
  synopsis?: string;
  genres?: Array<{ mal_id: number; name: string }>;
  themes?: Array<{ mal_id: number; name: string }>;
  demographics?: Array<{ mal_id: number; name: string }>;
  studios?: Array<{ mal_id: number; name: string }>;
  trailer_url?: string | null;
  trailer_youtube_id?: string | null;
  aired?: any;
  duration?: string;
  broadcast?: any;
  source?: string;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch trending anime on initial load
  useEffect(() => {
    fetchTrendingAnime();
    fetchTopAiringAnime();
    inputRef.current?.focus();
  }, []);

  const fetchTrendingAnime = async () => {
    try {
      const res = await fetch(`${API_URL}/anime/trending`);
      const data = await res.json();
      setTrendingAnime(data);
    } catch (err) {
      console.error("Failed to fetch trending anime:", err);
    }
  };

  const fetchTopAiringAnime = async () => {
    try {
      const res = await fetch(`${API_URL}/anime/top-airing`);
      const data = await res.json();
      console.log("Top Airing Data:", data);
      setTopAiringAnime(data);
    } catch (err) {
      console.error("Failed to fetch top airing anime:", err);
    }
  };

  const searchAnime = async () => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedAnime(null);

    try {
      const res = await fetch(`${API_URL}/anime/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setAnimeList(data);
      if (data.length === 0) {
        setError("No anime found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to fetch anime. Please try again.");
      console.error("Failed to fetch anime:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") searchAnime();
  };

  const clearSearch = () => {
    setQuery("");
    setAnimeList([]);
    setError("");
    setSelectedAnime(null);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header - Minimal */}
        <header className="py-4 md:py-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Anime<span className="text-gray-400">Galaxy</span>
            </h1>
          </div>
        </header>

        {/* Top Airing Anime Section */}
        {topAiringAnime.length > 0 && animeList.length === 0 && (
          <div className="mb-8 md:mb-12">
            {/* Top Airing Trailer/Highlight */}
            <div className="mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {/* Video Player */}
                {topAiringAnime[0]?.trailer_youtube_id ? (
                  <TrailerPlayer
                    youtubeId={topAiringAnime[0].trailer_youtube_id}
                    title={topAiringAnime[0].title}
                    autoPlay={true}
                  />
                ) : (
                  // Fallback when no trailer
                  <div className="relative aspect-video bg-linear-to-br from-gray-900 to-black">
                    <img
                      src={topAiringAnime[0]?.images?.jpg?.large_image_url}
                      alt={topAiringAnime[0]?.title}
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-white" />
                  More Currently Airing
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topAiringAnime.slice(1, 5).map((anime: Anime) => (
                  <div
                    key={anime.mal_id}
                    onClick={() => setSelectedAnime(anime)}
                    className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="relative aspect-3/4">
                      <img
                        src={anime.images?.jpg?.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Blur effect overlay at bottom of image */}
                      <div className="blur absolute">
                        <img
                          src={anime.images?.jpg?.image_url}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>

                      {/* Ranking badge - top left */}
                      <div className="absolute top-2 left-2 z-10">
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-xs">
                          <TrendingUp className="w-3 h-3 text-white" />
                          <span className="font-bold">#{anime.rank || 'New'}</span>
                        </div>
                      </div>

                      {/* Rating badge - top right */}
                      {anime.score && (
                        <div className="absolute top-2 left-16 z-10">
                          <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{anime.score.toFixed(1)}</span>
                          </div>
                        </div>
                      )}

                      {/* Content overlay at bottom left of image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent">
                        <div className="space-y-2">
                          {/* Anime title */}
                          <h3 className="font-bold text-white text-sm line-clamp-1">
                            {anime.title}
                          </h3>

                          {/* Status/Episodes */}
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 text-gray-200">
                              {anime.status === 'Currently Airing' ? (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                  <span>Ongoing</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3" />
                                  <span>{anime.episodes || '?'} eps</span>
                                </>
                              )}
                            </div>
                            {anime.episodes && anime.status !== 'Currently Airing' && (
                              <span className="text-gray-500">•</span>
                            )}
                            {anime.episodes && anime.status !== 'Currently Airing' && (
                              <span className="text-gray-400">Complete</span>
                            )}
                          </div>

                          {/* Genre tags (max 2) */}
                          <div className="flex flex-wrap gap-2">
                            {anime.genres?.slice(0, 2).map((genre) => (
                              <span
                                key={genre.mal_id}
                                className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trailer link (optional) */}
                    {/* {anime.trailer_youtube_id && (
                      <a
                        href={`https://www.youtube.com/watch?v=${anime.trailer_youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1 text-xs text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors border border-white/20"
                      >
                        <Play className="w-3 h-3" />
                        Trailer
                      </a>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="pb-24">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-md mx-auto text-center py-8">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Search Results */}
          {animeList.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  Search Results ({animeList.length})
                </h2>
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {animeList.map((anime: Anime) => (
                  <div
                    key={anime.mal_id}
                    onClick={() => setSelectedAnime(anime)}
                    className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="relative aspect-3/4">
                      <img
                        src={anime.images?.jpg?.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Blur effect overlay at bottom of image */}
                      <div className="blur absolute">
                        <img
                          src={anime.images?.jpg?.image_url}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>

                      {/* Ranking badge - top left */}
                      <div className="absolute top-2 left-2 z-10">
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-xs">
                          <TrendingUp className="w-3 h-3 text-white" />
                          <span className="font-bold">#{anime.rank || 'New'}</span>
                        </div>
                      </div>

                      {/* Rating badge - top right */}
                      {anime.score && (
                        <div className="absolute top-2 left-18 z-10">
                          <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{anime.score.toFixed(1)}</span>
                          </div>
                        </div>
                      )}

                      {/* Content overlay at bottom left of image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent">
                        <div className="space-y-2">
                          {/* Anime title */}
                          <h3 className="font-bold text-white text-sm line-clamp-1">
                            {anime.title}
                          </h3>

                          {/* Status/Episodes */}
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
                                  <span>{anime.episodes || '?'} eps</span>
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
                                <span className="text-gray-400">Complete</span>
                              </>
                            )}
                          </div>

                          {/* Genre tags (max 2) */}
                          <div className="flex flex-wrap gap-2">
                            {anime.genres?.slice(0, 2).map((genre) => (
                              <span
                                key={genre.mal_id}
                                className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !loading && !error && trendingAnime.length > 0 && (
            /* Trending Section */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Popular Anime</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingAnime.slice(0, 10).map((anime: Anime) => (
                  <div
                    key={anime.mal_id}
                    onClick={() => setSelectedAnime(anime)}
                    className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="relative aspect-3/4">
                      <img
                        src={anime.images?.jpg?.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Blur effect overlay at bottom of image */}
                      <div className="blur absolute">
                        <img
                          src={anime.images?.jpg?.image_url}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>

                      {/* Ranking badge - top left */}
                      <div className="absolute top-2 left-2 z-10">
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-xs">
                          <TrendingUp className="w-3 h-3 text-white" />
                          <span className="font-bold">#{anime.rank || 'New'}</span>
                        </div>
                      </div>

                      {/* Rating badge - top right */}
                      {anime.score && (
                        <div className="absolute top-2 left-19 z-10">
                          <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{anime.score.toFixed(1)}</span>
                          </div>
                        </div>
                      )}

                      {/* Content overlay at bottom left of image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent">
                        <div className="space-y-2">
                          {/* Anime title */}
                          <h3 className="font-bold text-white text-sm line-clamp-1">
                            {anime.title}
                          </h3>

                          {/* Status/Episodes */}
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
                                  <span>{anime.episodes || '?'} eps</span>
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
                                <span className="text-gray-400">Complete</span>
                              </>
                            )}
                          </div>

                          {/* Genre tags (max 2) */}
                          <div className="flex flex-wrap gap-2">
                            {anime.genres?.slice(0, 2).map((genre) => (
                              <span
                                key={genre.mal_id}
                                className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Fixed Bottom Search Bar */}
        <div className="fixed bottom-0 left-0 right-0 border-gray-800 p-4 z-50">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 rounded-full bg-black border border-gray-700 focus:border-white focus:outline-none text-white placeholder-gray-500 pl-10"
              />

              {/* Search button inside input field */}
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={searchAnime}
                  disabled={loading || !query.trim()}
                  className="px-4 py-2 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-medium text-black flex items-center gap-2 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Anime Modal */}
        {selectedAnime && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/90"
              onClick={() => setSelectedAnime(null)}
            />
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-lg border border-gray-800">
              <div className="sticky top-0 flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800 z-10">
                <h2 className="text-xl font-bold text-white">{selectedAnime.title}</h2>
                <button
                  onClick={() => setSelectedAnime(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-4 md:p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                      src={selectedAnime.images?.jpg?.large_image_url}
                      alt={selectedAnime.title}
                      className="w-full rounded-lg mb-4"
                    />

                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {selectedAnime.score && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-white">{selectedAnime.score}/10</span>
                        </div>
                      )}
                      {selectedAnime.year && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                          <span className="text-white">{selectedAnime.year}</span>
                        </div>
                      )}
                    </div>

                    {selectedAnime.synopsis && (
                      <div>
                        <h3 className="font-bold mb-2 text-white">Synopsis</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedAnime.synopsis}</p>
                      </div>
                    )}

                    {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2 text-white">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAnime.genres.map((genre) => (
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
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}