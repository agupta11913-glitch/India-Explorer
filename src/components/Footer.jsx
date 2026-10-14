import { FaGlobeAmericas, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#020f0b] border-t border-white/10 py-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-orange-400">
            <FaGlobeAmericas className="text-xl" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-none">
              India <span className="text-orange-300">Explorer</span>
            </h3>
            <p className="text-xs text-emerald-100/60 mt-1">
              Celebrating the timeless beauty &amp; heritage of Incredible India
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-emerald-100/75">
          <a href="#" className="hover:text-orange-300 transition">
            Home
          </a>
          <a href="#explore-map" className="hover:text-orange-300 transition">
            Interactive Map
          </a>
          <a href="#states" className="hover:text-orange-300 transition">
            States
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-emerald-100/60 flex items-center gap-1.5">
          <span>Crafted with</span>
          <FaHeart className="text-orange-400 text-xs" />
          <span>for Indian Tourism</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
