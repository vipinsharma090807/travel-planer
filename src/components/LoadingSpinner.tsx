import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FaSpinner className={`animate-spin text-blue-600 mb-2 ${sizeClasses[size]}`} />
      <p className="text-gray-700">{message}</p>
    </div>
  );
} 