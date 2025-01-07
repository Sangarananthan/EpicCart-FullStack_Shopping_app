import { Heart } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../redux/features/favorites/favoriteSlice";

const FloatingHeart = ({ style }) => (
  <Heart
    className="absolute w-4 h-4 text-red-500 fill-red-500 animate-burst pointer-events-none"
    style={style}
  />
);

const BreakingHeart = () => (
  <div className="relative">
    <Heart className="w-5 h-5 fill-red-500 text-red-500 opacity-0" />{" "}
    {/* Placeholder for sizing */}
    <svg className="absolute top-0 left-0 w-5 h-5" viewBox="0 0 24 24">
      {/* Left half of the heart */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09"
        className="animate-break-left stroke-red-500 fill-red-500"
        strokeWidth="2"
      />
      {/* Right half of the heart */}
      <path
        d="M12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3c-1.74 0-3.41.81-4.5 2.09"
        className="animate-break-right stroke-red-500 fill-red-500"
        strokeWidth="2"
      />
    </svg>
  </div>
);

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const isLiked = favorites.some((fav) => fav._id === product._id);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [isBreaking, setIsBreaking] = useState(false);

  const createFloatingHeart = useCallback(() => {
    const id = Math.random();
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 30;

    const newHeart = {
      id,
      style: {
        "--angle": `${angle}rad`,
        "--distance": `${distance}px`,
      },
    };

    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((heart) => heart.id !== id));
    }, 1000);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      setIsBreaking(true);
      setTimeout(() => {
        dispatch(removeFavorite(product));
        setIsBreaking(false);
      }, 600);
    } else {
      dispatch(addFavorite(product));
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createFloatingHeart(), i * 50);
      }
    }
  };

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {!isBreaking && (
        <Heart
          onClick={handleClick}
          className={`w-5 h-5 cursor-pointer transition-all duration-300 ease-in-out 
            ${isLiked ? "fill-red-500 text-red-500 scale-125" : "text-white"}
            hover:scale-110 active:scale-95`}
        />
      )}
      {isBreaking && <BreakingHeart />}
      {floatingHearts.map((heart) => (
        <FloatingHeart key={heart.id} style={heart.style} />
      ))}
    </div>
  );
};

// Add required keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes burst {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
      opacity: 0.8;
      transform: 
        translate(
          calc(-50% + calc(cos(var(--angle)) * var(--distance))),
          calc(-50% + calc(sin(var(--angle)) * var(--distance)))
        )
        scale(1.2);
    }
    100% {
      opacity: 0;
      transform: 
        translate(
          calc(-50% + calc(cos(var(--angle)) * calc(var(--distance) * 2))),
          calc(-50% + calc(sin(var(--angle)) * calc(var(--distance) * 2)))
        )
        scale(0.3);
    }
  }

  @keyframes break-left {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0);
    }
    100% {
      opacity: 0;
      transform: translate(-100%, 100%) rotate(-45deg);
    }
  }

  @keyframes break-right {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0);
    }
    100% {
      opacity: 0;
      transform: translate(100%, 100%) rotate(45deg);
    }
  }

  .animate-burst {
    animation: burst 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    left: 50%;
    top: 50%;
  }

  .animate-break-left {
    animation: break-left 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    transform-origin: center right;
  }

  .animate-break-right {
    animation: break-right 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    transform-origin: center left;
  }
`;
document.head.appendChild(style);

export default HeartIcon;
