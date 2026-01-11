import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "default", text = "LOADING..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2
        className={`${sizeClasses[size]} text-accent-orange animate-spin`}
      />
      {text && <p className="mt-3 text-sm font-mono text-text-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
