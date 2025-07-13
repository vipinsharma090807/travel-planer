import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message,
  className = '',
  onRetry
}: ErrorMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`} role="alert">
      <FaExclamationTriangle className="text-red-500 text-3xl mb-3" />
      <p className="text-red-600 font-medium mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
} 