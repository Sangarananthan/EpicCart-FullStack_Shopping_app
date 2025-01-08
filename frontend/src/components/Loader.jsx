import { cn } from "../lib/utils";

const Loader = ({ className, size = "default" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-8 w-8 border-3",
    large: "h-16 w-16 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        "border-t-primary",
        "border-l-transparent border-r-transparent border-b-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
