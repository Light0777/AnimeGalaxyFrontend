// types/anime.ts
export interface Anime {
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