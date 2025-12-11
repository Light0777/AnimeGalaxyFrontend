// components/Modal.tsx
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-lg border border-gray-800">
        {(title || true) && (
          <div className="sticky top-0 flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800 z-10">
            {title && (
              <h2 className="text-xl font-bold text-white">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}