// components/RankBadge.tsx
import { TrendingUp } from "lucide-react";

// Helper function (moved from HomePage)
const getRankColor = (rank?: number) => {
  if (!rank || rank <= 0) {
    return {
      primary: '#A7B0C0',
      highlight: '#8A94A6',
      accent: '#5C6675',
      text: 'text-white'
    };
  }

  if (rank <= 10) {
    return {
      primary: '#FF3B30',
      highlight: '#FF5C5C',
      accent: '#B02222',
      text: 'text-white'
    };
  } else if (rank <= 100) {
    return {
      primary: '#F7C948',
      highlight: '#F5A623',
      accent: '#C57F17',
      text: 'text-black'
    };
  } else if (rank <= 500) {
    return {
      primary: '#3A7DFF',
      highlight: '#5E9CFF',
      accent: '#1F4EB8',
      text: 'text-white'
    };
  } else {
    return {
      primary: '#A7B0C0',
      highlight: '#8A94A6',
      accent: '#5C6675',
      text: 'text-white'
    };
  }
};

interface RankBadgeProps {
  rank?: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  const colors = getRankColor(rank);

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 backdrop-blur-sm rounded-full text-xs"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.highlight} 50%, ${colors.accent} 100%)`,
        border: `1px solid ${colors.accent}`
      }}
    >
      <TrendingUp className="w-3 h-3" style={{ color: colors.text === 'text-white' ? 'white' : 'black' }} />
      <span className={`font-bold ${colors.text}`}>#{rank || 'New'}</span>
    </div>
  );
}