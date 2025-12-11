// components/ErrorDisplay.tsx
interface ErrorDisplayProps {
  error: string;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="max-w-md mx-auto text-center py-8">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );
}