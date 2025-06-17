import React from "react";
import { Link, useLocation } from "react-router-dom";
import { StarIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useDarkMode } from "../../context/DarkModeContext";

export const NavigationBar = (): JSX.Element => {
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const isFavorites = location.pathname === "/favorites";
  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/profile";

  return (
    <nav className={`fixed w-full h-[60px] bottom-0 left-0 flex justify-around items-center z-20 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#2f3136]' : 'bg-[#5586c94c]'
    }`}>
      <Link
        className={`w-20 h-10 rounded-[20px] border-2 border-solid flex items-center justify-center transition-colors duration-200 ${
          isFavorites 
            ? "bg-fern-green border-fern-green" 
            : isDarkMode 
              ? "bg-[#40444b] border-[#4f545c] hover:bg-[#4f545c]" 
              : "bg-white border-[#000000cc]"
        }`}
        to="/favorites"
      >
        <StarIcon className={`w-[31px] h-[31px] transition-colors duration-200 ${
          isDarkMode && !isFavorites ? 'text-gray-300' : 'text-black'
        }`} />
      </Link>

      <Link
        className={`w-20 h-10 rounded-[20px] border-2 border-solid flex items-center justify-center transition-colors duration-200 ${
          isHome 
            ? "bg-fern-green border-fern-green" 
            : isDarkMode 
              ? "bg-[#40444b] border-[#4f545c] hover:bg-[#4f545c]" 
              : "bg-white border-[#000000cc]"
        }`}
        to="/"
      >
        <HomeIcon className={`w-[30px] h-[30px] transition-colors duration-200 ${
          isDarkMode && !isHome ? 'text-gray-300' : 'text-black'
        }`} />
      </Link>

      <Link
        className={`w-20 h-10 rounded-[20px] border-2 border-solid flex items-center justify-center transition-colors duration-200 ${
          isProfile 
            ? "bg-fern-green border-fern-green" 
            : isDarkMode 
              ? "bg-[#40444b] border-[#4f545c] hover:bg-[#4f545c]" 
              : "bg-white border-[#000000cc]"
        }`}
        to="/profile"
      >
        <UserIcon className={`w-[30px] h-[30px] transition-colors duration-200 ${
          isDarkMode && !isProfile ? 'text-gray-300' : 'text-black'
        }`} />
      </Link>
    </nav>
  );
}; 