// HomePage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import AnimeGrid from "./AnimeGrid";
import TopAiringSection from "./TopAiringSection";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import Modal from "./Modal";
import AnimeModalContent from "./AnimeModalContent";
import { Anime } from "../types/anime";

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

  const clearSearch = () => {
    setQuery("");
    setAnimeList([]);
    setError("");
    setSelectedAnime(null);
    inputRef.current?.focus();
  };

  const handleAnimeClick = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  return (
    <div className="min-h-screen bg-black text-white">
        <Header />
      <div className="relative z-10 max-w-4xl 2xl:max-w-7xl mx-auto px-4 md:px-8">

        {/* Top Airing Section */}
        {topAiringAnime.length > 0 && animeList.length === 0 && (
          <TopAiringSection
            topAiringAnime={topAiringAnime}
            onAnimeClick={handleAnimeClick}
          />
        )}

        <main className="pb-24">
          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          <ErrorDisplay error={error} />

          {/* Search Results */}
          {animeList.length > 0 ? (
            <AnimeGrid
              animes={animeList}
              title={`Search Results (${animeList.length})`}
              onAnimeClick={handleAnimeClick}
              clearSearch={clearSearch}
              showClearButton
            />
          ) : !loading && !error && trendingAnime.length > 0 && (
            <AnimeGrid
              animes={trendingAnime.slice(0, 10)}
              title="Popular Anime"
              onAnimeClick={handleAnimeClick}
              columns={{ base: 2, sm: 3, md: 4, lg: 5 }}
            />
          )}
        </main>

        <SearchBar
          query={query}
          setQuery={setQuery}
          searchAnime={searchAnime}
          loading={loading}
          inputRef={inputRef}
        />

        {/* Selected Anime Modal */}
        <Modal
          isOpen={!!selectedAnime}
          onClose={() => setSelectedAnime(null)}
          title={selectedAnime?.title}
        >
          {selectedAnime && <AnimeModalContent anime={selectedAnime} />}
        </Modal>
      </div>
    </div>
  );
}