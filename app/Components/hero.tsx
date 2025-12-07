"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Star, Calendar, Play, TrendingUp } from "lucide-react";

export default function HomePage() {
    const [query, setQuery] = useState("");
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedAnime, setSelectedAnime] = useState<any>(null);
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [dots, setDots] = useState<{ left: number; top: number; delay: number; duration: number }[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Generate animated dots
    useEffect(() => {
        const generatedDots = [...Array(20)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4
        }));
        setDots(generatedDots);
    }, []);

    // Fetch trending anime on initial load
    useEffect(() => {
        fetchTrendingAnime();
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
        <div className="min-h-screen bg-linear-to-b from-gray-900 to-black text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -inset-2.5">
                    {dots.map((dot, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-500 rounded-full animate-float"
                            style={{
                                left: `${dot.left}%`,
                                top: `${dot.top}%`,
                                animationDelay: `${dot.delay}s`,
                                animationDuration: `${dot.duration}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
                {/* Header */}
                <header className="mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AnimeGalaxy
                            </h1>
                            <p className="text-gray-400 mt-2">Discover your next favorite anime</p>
                        </div>

                        {animeList.length > 0 && (
                            <button
                                onClick={clearSearch}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto px-2 sm:px-0">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500" />
                            <div className="relative flex sm:flex-row gap-2 sm:gap-3">
                                <div className="relative flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search for anime..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full p-3 sm:p-4 rounded-2xl bg-gray-900/90 backdrop-blur-sm border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all pl-10 sm:pl-12 text-sm sm:text-base"
                                    />
                                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    </div>
                                </div>
                                <button
                                    onClick={searchAnime}
                                    disabled={loading}
                                    className="px-4 sm:px-8 py-3 sm:py-0 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 min-h-11 sm:min-h-0"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                    <span className="hidden sm:inline">Search</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 justify-center">
                            {["One Piece", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen"].map(
                                (title) => (
                                    <button
                                        key={title}
                                        onClick={() => {
                                            setQuery(title);
                                            searchAnime();
                                        }}
                                        className="px-2.5 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-full transition-colors whitespace-nowrap"
                                    >
                                        {title}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-purple-500 animate-pulse" />
                            </div>
                            <p className="mt-4 text-gray-400 animate-pulse">Searching the animeverse...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="max-w-md mx-auto text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full mb-4">
                                <div className="w-8 h-8 border-2 border-red-500 rounded-full animate-ping" />
                            </div>
                            <p className="text-red-400">{error}</p>
                            <button
                                onClick={fetchTrendingAnime}
                                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                View Trending Anime
                            </button>
                        </div>
                    )}

                    {/* Results Section */}
                    {animeList.length > 0 ? (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Play className="w-6 h-6 text-purple-400" />
                                    Search Results
                                    <span className="text-gray-400 text-sm font-normal">
                                        ({animeList.length} found)
                                    </span>
                                </h2>
                            </div>

                            {/* Anime Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {animeList.map((anime: any) => (
                                    <div
                                        key={anime.mal_id}
                                        onClick={() => setSelectedAnime(selectedAnime?.mal_id === anime.mal_id ? null : anime)}
                                        className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                    >
                                        {/* Anime Image */}
                                        <div className="relative overflow-hidden aspect-2/3">
                                            <img
                                                src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                                            {/* Score Badge */}
                                            {anime.score && (
                                                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-xs font-bold">{anime.score}</span>
                                                </div>
                                            )}

                                            {/* Year Badge */}
                                            {anime.year && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-xs">{anime.year}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Anime Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold line-clamp-2 group-hover:text-purple-300 transition-colors">
                                                {anime.title}
                                            </h3>

                                            {/* Episodes */}
                                            {anime.episodes && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {anime.episodes} episodes
                                                </p>
                                            )}

                                            {/* Genres */}
                                            {anime.genres && anime.genres.slice(0, 2).map((genre: any) => (
                                                <span
                                                    key={genre.mal_id}
                                                    className="inline-block mt-2 mr-1 px-2 py-1 text-xs bg-purple-900/30 text-purple-300 rounded-full"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Hover Effect */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-2xl transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !loading && !error && (
                        /* Trending Section - Shows when no search has been made */
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-pink-400" />
                                    Trending Now
                                </h2>
                                <button
                                    onClick={fetchTrendingAnime}
                                    className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Loader2 className="w-4 h-4" />
                                    Refresh
                                </button>
                            </div>

                            {/* Trending Grid */}
                            {trendingAnime.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                    {trendingAnime.slice(0, 10).map((anime: any) => (
                                        <div
                                            key={anime.mal_id}
                                            className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300"
                                        >
                                            <div className="relative overflow-hidden aspect-2/3">
                                                <img
                                                    src={anime.images.jpg.large_image_url}
                                                    alt={anime.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                                                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                                                    <TrendingUp className="w-3 h-3 text-pink-400" />
                                                    <span className="text-xs font-bold">#{anime.rank}</span>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="font-bold line-clamp-2">{anime.title}</h3>
                                                {anime.score && (
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm">{anime.score}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-gray-400">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Loading trending anime...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selected Anime Modal */}
                    {selectedAnime && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setSelectedAnime(null)}
                            />
                            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-gray-800">
                                <div className="sticky top-0 flex justify-between items-center p-6 bg-linear-to-b from-gray-900 to-transparent z-10">
                                    <h2 className="text-2xl font-bold">{selectedAnime.title}</h2>
                                    <button
                                        onClick={() => setSelectedAnime(null)}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <img
                                                src={selectedAnime.images.jpg.large_image_url}
                                                alt={selectedAnime.title}
                                                className="w-full rounded-xl"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <div className="flex flex-wrap gap-4">
                                                {selectedAnime.score && (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                                        <span className="font-bold">{selectedAnime.score}/10</span>
                                                    </div>
                                                )}
                                                {selectedAnime.year && (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                                                        <Calendar className="w-5 h-5" />
                                                        <span>{selectedAnime.year}</span>
                                                    </div>
                                                )}
                                                {selectedAnime.episodes && (
                                                    <div className="px-4 py-2 bg-gray-800 rounded-lg">
                                                        {selectedAnime.episodes} episodes
                                                    </div>
                                                )}
                                            </div>

                                            {selectedAnime.synopsis && (
                                                <div>
                                                    <h3 className="font-bold mb-2">Synopsis</h3>
                                                    <p className="text-gray-300 leading-relaxed">{selectedAnime.synopsis}</p>
                                                </div>
                                            )}

                                            {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                                                <div>
                                                    <h3 className="font-bold mb-2">Genres</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedAnime.genres.map((genre: any) => (
                                                            <span
                                                                key={genre.mal_id}
                                                                className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-full"
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
                </main>

                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
                    <p>Powered by Jikan API • AnimeVerse © {new Date().getFullYear()}</p>
                    <p className="mt-2">Made with ❤️ for anime fans worldwide</p>
                </footer>
            </div>

            {/* Add CSS animations */}
            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
        </div>
    );
}