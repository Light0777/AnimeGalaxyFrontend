"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAnime = async () => {
    if (!query.trim()) return;
    setLoading(true);

    const res = await fetch(`http://localhost:3000/anime/search?q=${query}`);
    const data = await res.json();

    setAnimeList(data);
    setLoading(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") searchAnime();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:outline-none"
          />
          <button
            onClick={searchAnime}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-neutral-400">Searching...</p>
        )}

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {animeList.map((anime: any) => (
            <div
              key={anime.mal_id}
              className="bg-neutral-900 p-3 rounded-xl hover:scale-105 transition cursor-pointer"
            >
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="rounded-lg mb-2 w-full h-48 object-cover"
              />
              <h3 className="text-sm font-bold line-clamp-2">{anime.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Score: {anime.score ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
