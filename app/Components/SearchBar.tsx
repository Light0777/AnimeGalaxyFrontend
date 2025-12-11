// components/SearchBar.tsx
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  searchAnime: () => void;
  loading: boolean;
  clearSearch?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function SearchBar({
  query,
  setQuery,
  searchAnime,
  loading,
  inputRef,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") searchAnime();
  };

  return (
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
            className="w-full p-3 pr-24 rounded-full bg-black border border-gray-700 focus:border-white focus:outline-none text-white placeholder-gray-500 pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-gray-400" />
          </div>

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
  );
}