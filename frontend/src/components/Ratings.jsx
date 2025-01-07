import { Star } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Ratings = ({ value, text, className }) => {
  const stars = Array(5).fill(0);
  const roundedValue = Math.round(value * 2) / 2;

  const renderStar = (index) => {
    const starValue = index + 1;
    const fillPercentage = Math.min(
      100,
      Math.max(0, (roundedValue - index) * 100)
    );

    return (
      <span key={index} className="relative inline-block">
        {/* Base star (empty) */}
        <Star className={cn("w-4 h-4 stroke-2", "text-gray-300", className)} />

        {/* Filled overlay */}
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star
            className={cn("w-4 h-4 stroke-2", "text-yellow-500", className)}
          />
        </span>
      </span>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1.5">
          <div
            className="flex gap-0.5"
            role="img"
            aria-label={`${value} out of 5 stars`}
          >
            {stars.map((_, index) => renderStar(index))}
          </div>
          {text && <span className="text-sm text-gray-500 ml-2">{text}</span>}
        </TooltipTrigger>
        <TooltipContent>
          <p>{value} out of 5 stars</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

Ratings.defaultProps = {
  className: "",
};

export default Ratings;
