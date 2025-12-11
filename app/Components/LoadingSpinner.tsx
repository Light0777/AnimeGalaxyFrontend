// components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Searching..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
}