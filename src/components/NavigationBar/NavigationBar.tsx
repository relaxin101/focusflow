import React from "react";
import { Link, useLocation } from "react-router-dom";
import { StarIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";

export const NavigationBar = (): JSX.Element => {
  const location = useLocation();
  const isFavorites = location.pathname === "/favorites";
  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/profile";

  return (
    <nav className="fixed w-full h-[60px] bottom-0 left-0 bg-[#5586c94c] flex justify-around items-center z-20">
      <Link
        className={`w-20 h-10 rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center ${
          isFavorites ? "bg-fern-green" : "bg-white"
        }`}
        to="/favorites"
      >
        <StarIcon className="w-[31px] h-[31px]" />
      </Link>

      <Link
        className={`w-20 h-10 rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center ${
          isHome ? "bg-fern-green" : "bg-white"
        }`}
        to="/"
      >
        <HomeIcon className="w-[30px] h-[30px]" />
      </Link>

      <Link
        className={`w-20 h-10 rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center ${
          isProfile ? "bg-fern-green" : "bg-white"
        }`}
        to="/profile"
      >
        <UserIcon className="w-[30px] h-[30px]" />
      </Link>
    </nav>
  );
}; 