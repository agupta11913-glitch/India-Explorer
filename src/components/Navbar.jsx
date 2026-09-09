// import { div, input } from "framer-motion/client";
import React, { useState } from "react";
import { FaGlobeAmericas, FaHeart } from "react-icons/fa";
import { IoSearch, IoMenu, IoClose } from "react-icons/io5";

const Navbar = ({searchText,setSearchText}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <nav className="bg-green-950 sticky top-0 z-50 px-4 py-3">
      {/* Main Navbar */}
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <FaGlobeAmericas className="text-white text-3xl lg:text-4xl" />

          <h2 className="text-white ml-2 text-xl lg:text-2xl">
            India Explorer
          </h2>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">

          <a
            href="#"
            className="text-white text-lg hover:text-orange-400 transition duration-300"
          >
            Home
          </a>

          <a
            href="#"
            className="text-white text-lg hover:text-orange-400 transition duration-300"
          >
            Explore
          </a>

          <a
            href="#"
            className="text-white text-lg flex items-center gap-2 hover:text-orange-400 transition duration-300"
          >
            <FaHeart />
            Favourite
          </a>
          <div className="relative flex items-center">
  <IoSearch
    className="absolute left-3 text-green-950 text-xl"
  />

  <input
    onChange={(e) => {
      setSearchText(e.target.value);
    }}
    value={searchText}
    className="w-[220px] h-9 pl-10 pr-4 rounded-full 
               bg-white/95 text-green-950 
               placeholder:text-slate-500
               outline-none border-1 border-orange-400
               focus:ring-2 focus:ring-orange-300
               transition duration-300"
    type="text"
    placeholder="Search a state..."
  />
</div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl"
        >
          {menuOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-5 pt-5 pb-3">

          <a
            href="#"
            className="text-white text-lg hover:text-orange-400 transition duration-300"
          >
            Home
          </a>

          <a
            href="#"
            className="text-white text-lg hover:text-orange-400 transition duration-300"
          >
            Explore
          </a>

          <a
            href="#"
            className="text-white text-lg flex items-center gap-2 hover:text-orange-400 transition duration-300"
          >
            <FaHeart />
            Favourite
          </a>
          <div className="relative flex items-center">
  <IoSearch
    className="absolute left-3 text-green-950 text-xl"
  />

  <input
    onChange={(e) => {
      setSearchText(e.target.value);
    }}
    value={searchText}
    className="w-[220px] h-9 pl-10 pr-4 rounded-full 
               bg-white/95 text-green-950 
               placeholder:text-slate-500
               outline-none border-1 border-orange-400
               focus:ring-2 focus:ring-orange-300
               transition duration-300"
    type="text"
    placeholder="Search a state..."
  />
</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;