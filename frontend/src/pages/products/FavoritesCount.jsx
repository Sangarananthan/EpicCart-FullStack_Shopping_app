import { useSelector } from "react-redux";
import { Badge, Heart } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect } from "react";

const FavoritesCount = ({ className }) => {
  // Access the Redux state to get the favorites and count
  const { favorites } = useSelector((state) => state.favorites);
  return (
    <div className={cn("relative inline-flex", className)}>
      <Heart className="w-5 h-5" />
      {favorites.length > 0 && (
        <h2 className="absolute -top-1 -right-1 h-[1rem] min-w-[1rem] px-1 flex items-center justify-center rounded-full bg-pink-500 text-white text-xs font-medium">
          {favorites.length}
        </h2>
      )}
    </div>
  );
};

export default FavoritesCount;
