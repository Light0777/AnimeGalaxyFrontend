"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Star, Calendar, Play, TrendingUp, X, ExternalLink, Volume2 } from "lucide-react";

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
    rank?: number; // Make this optional
    popularity?: number;
    synopsis?: string;
    genres?: Array<{ mal_id: number; name: string }>;
    themes?: Array<{ mal_id: number; name: string }>;
    demographics?: Array<{ mal_id: number; name: string }>;
    studios?: Array<{ mal_id: number; name: string }>;
    trailer_url?: string;
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
            console.log("Top Airing Data:", data); // Add this line
            console.log("First anime:", data[0]); // Add this line
            console.log("Trailer URL:", data[0]?.trailer_url); // Add this line
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
                            Anime<span className="text-gray-400">Verse</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Discover. Watch. Repeat.</p>
                    </div>
                </header>

                {/* Top Airing Anime Section */}
                {topAiringAnime.length > 0 && animeList.length === 0 && (
                    <div className="mb-8 md:mb-12">
                        {/* Top Airing Trailer/Highlight */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-white" />
                                <h2 className="text-xl font-bold text-white">Currently Airing Highlight</h2>
                            </div>

                            {topAiringAnime[0]?.trailer_url ? (
                                // Show trailer if available
                                <div className="relative rounded-xl overflow-hidden border border-gray-800">
                                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-black">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${extractYouTubeId(topAiringAnime[0].trailer_url)}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                                            className="w-full h-full"
                                            title={topAiringAnime[0].title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{topAiringAnime[0].title}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    {topAiringAnime[0].score && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-300">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                            <span>{topAiringAnime[0].score}</span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                                        {topAiringAnime[0].status || 'Airing'}
                                                    </span>
                                                </div>
                                            </div>
                                            <a
                                                href={topAiringAnime[0].trailer_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 text-sm bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-colors w-fit"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Watch Trailer
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Show poster with info when no trailer
                                <div className="relative rounded-xl overflow-hidden border border-gray-800">
                                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-black relative">
                                        <img
                                            src={topAiringAnime[0]?.images?.jpg?.large_image_url || topAiringAnime[0]?.images?.jpg?.image_url}
                                            alt={topAiringAnime[0]?.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                        <div className="absolute inset-0 flex items-end p-6">
                                            <div className="w-full">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">
                                                        NEW
                                                    </span>
                                                    <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
                                                        AIRING
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{topAiringAnime[0]?.title}</h3>
                                                <div className="flex items-center gap-4">
                                                    {topAiringAnime[0]?.score && (
                                                        <div className="flex items-center gap-2 text-lg text-white">
                                                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                            <span className="font-bold">{topAiringAnime[0].score}</span>
                                                            <span className="text-gray-300">/10</span>
                                                        </div>
                                                    )}
                                                    {topAiringAnime[0]?.episodes && (
                                                        <span className="text-gray-300">
                                                            {topAiringAnime[0].episodes} episodes
                                                        </span>
                                                    )}
                                                    {topAiringAnime[0]?.year && (
                                                        <span className="text-gray-300">
                                                            {topAiringAnime[0].year}
                                                        </span>
                                                    )}
                                                </div>
                                                {topAiringAnime[0]?.synopsis && (
                                                    <p className="text-gray-300 mt-3 line-clamp-2 text-sm">
                                                        {topAiringAnime[0].synopsis}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Top 4 Airing Anime Grid */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-white" />
                                    More Currently Airing
                                </h2>
                                <button
                                    onClick={fetchTopAiringAnime}
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Loader2 className="w-3 h-3" />
                                    Refresh
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {topAiringAnime.slice(1, 5).map((anime: Anime) => (
                                    <div
                                        key={anime.mal_id}
                                        onClick={() => setSelectedAnime(anime)}
                                        className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                    >
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={anime.images?.jpg?.image_url}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <div className="absolute top-2 left-2">
                                                <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs">
                                                    <TrendingUp className="w-3 h-3 text-white" />
                                                    <span className="font-bold">#{anime.rank}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm line-clamp-2 text-white group-hover:text-gray-300 transition-colors">
                                                {anime.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                {anime.score ? (
                                                    <div className="flex items-center gap-1 text-xs text-gray-300">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span>{anime.score}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">No score</span>
                                                )}
                                                <span className="text-xs text-gray-400">{anime.episodes || '?'} eps</span>
                                            </div>
                                            {anime.trailer_url && (
                                                <a
                                                    href={anime.trailer_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <Play className="w-3 h-3" />
                                                    Trailer
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="pb-24"> {/* Added padding bottom for fixed search bar */}
                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                            <p className="mt-4 text-gray-400">Searching...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="max-w-md mx-auto text-center py-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-900/20 rounded-full mb-4">
                                <div className="w-6 h-6 border border-red-500 rounded-full animate-ping" />
                            </div>
                            <p className="text-red-400 text-sm">{error}</p>
                            <button
                                onClick={fetchTrendingAnime}
                                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                            >
                                View Trending Anime
                            </button>
                        </div>
                    )}

                    {/* Results Section */}
                    {animeList.length > 0 ? (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    Search Results
                                    <span className="text-gray-400 text-sm font-normal ml-2">
                                        ({animeList.length} found)
                                    </span>
                                </h2>
                                <button
                                    onClick={clearSearch}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Anime Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {animeList.map((anime: Anime) => (
                                    <div
                                        key={anime.mal_id}
                                        onClick={() => setSelectedAnime(anime)}
                                        className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={anime.images?.jpg?.image_url}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            {anime.score && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold">{anime.score}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm line-clamp-2 text-white group-hover:text-gray-300 transition-colors">
                                                {anime.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                {anime.year && (
                                                    <span className="text-xs text-gray-400">{anime.year}</span>
                                                )}
                                                {anime.episodes && (
                                                    <span className="text-xs text-gray-400">{anime.episodes} eps</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !loading && !error && trendingAnime.length > 0 && (
                        /* Trending Section */
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    Popular Anime
                                </h2>
                                <button
                                    onClick={fetchTrendingAnime}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* Trending Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {trendingAnime.slice(0, 10).map((anime: Anime) => (
                                    <div
                                        key={anime.mal_id}
                                        onClick={() => setSelectedAnime(anime)}
                                        className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={anime.images?.jpg?.image_url}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute top-2 left-2">
                                                <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs">
                                                    <TrendingUp className="w-3 h-3 text-white" />
                                                    <span className="font-bold">#{anime.rank}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm line-clamp-2 text-white">
                                                {anime.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                {anime.score && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-300">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span>{anime.score}</span>
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-400">{anime.episodes || '?'} eps</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                {/* Fixed Bottom Search Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 z-50">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search anime..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-white focus:outline-none text-white placeholder-gray-500 pl-10"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <button
                                onClick={searchAnime}
                                disabled={loading}
                                className="px-4 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-black transition-colors flex items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                            {["One Piece", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen"].map(
                                (title) => (
                                    <button
                                        key={title}
                                        onClick={() => {
                                            setQuery(title);
                                            searchAnime();
                                        }}
                                        className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-full transition-colors text-gray-300 whitespace-nowrap"
                                    >
                                        {title}
                                    </button>
                                )
                            )}
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
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
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
                                            className="w-full rounded-lg"
                                        />
                                        {selectedAnime.trailer_url && (
                                            <a
                                                href={selectedAnime.trailer_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-colors text-sm"
                                            >
                                                <Play className="w-4 h-4" />
                                                Watch Trailer
                                            </a>
                                        )}
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
                                            {selectedAnime.episodes && (
                                                <div className="px-3 py-2 bg-gray-800 rounded-lg text-white">
                                                    {selectedAnime.episodes} episodes
                                                </div>
                                            )}
                                        </div>

                                        {selectedAnime.synopsis && (
                                            <div>
                                                <h3 className="font-bold mb-2 text-white">Synopsis</h3>
                                                <p className="text-gray-300 leading-relaxed text-sm">{selectedAnime.synopsis}</p>
                                            </div>
                                        )}

                                        {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                                            <div>
                                                <h3 className="font-bold mb-2 text-white">Genres</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedAnime.genres.map((genre) => (
                                                        <span
                                                            key={genre.mal_id}
                                                            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm"
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

// Helper function to extract YouTube ID - IMPROVED VERSION
function extractYouTubeId(url: string): string {
    if (!url) return '';

    console.log("Extracting YouTube ID from:", url); // Debug log

    // Handle different YouTube URL formats
    // Format 1: https://www.youtube.com/watch?v=VIDEO_ID
    // Format 2: https://youtu.be/VIDEO_ID
    // Format 3: https://www.youtube.com/embed/VIDEO_ID

    let videoId = '';

    // Try standard YouTube watch URL
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
    }
    // Try youtu.be short URL
    else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
        const questionMarkPosition = videoId.indexOf('?');
        if (questionMarkPosition !== -1) {
            videoId = videoId.substring(0, questionMarkPosition);
        }
    }
    // Try embed URL
    else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1];
    }

    // Clean up any extra parameters
    videoId = videoId.split('?')[0].split('&')[0].split('#')[0];

    console.log("Extracted YouTube ID:", videoId); // Debug log

    return videoId;
}