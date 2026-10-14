import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGlobeAmericas, FaHeart } from "react-icons/fa";
import { FaLocationDot, FaArrowRight } from "react-icons/fa6";
import { IoSearch, IoMenu, IoClose } from "react-icons/io5";
import states from "../data/state";
import { useFavorites } from "../context/FavoritesContext";
import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

function getGlobalSearchResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { matchingRegions: [], matchingPlaces: [] };

  const matchingRegions = states.filter(
    (reg) =>
      reg.state.toLowerCase().includes(q) ||
      reg.capital.toLowerCase().includes(q)
  );

  const matchingPlaces = [];
  for (const reg of states) {
    for (const place of reg.touristPlaces || []) {
      const matchesCategories = Array.isArray(place.categories)
        ? place.categories.some((c) => c.toLowerCase().includes(q))
        : false;
      if (
        place.name.toLowerCase().includes(q) ||
        place.city.toLowerCase().includes(q) ||
        (place.location && place.location.toLowerCase().includes(q)) ||
        reg.state.toLowerCase().includes(q) ||
        reg.capital.toLowerCase().includes(q) ||
        (place.category && place.category.toLowerCase().includes(q)) ||
        matchesCategories
      ) {
        matchingPlaces.push({ place, region: reg });
      }
    }
  }

  return { matchingRegions, matchingPlaces };
}

const Navbar = ({ searchText, setSearchText }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const { matchingRegions, matchingPlaces } = getGlobalSearchResults(searchText);
  const totalMatches = matchingRegions.length + matchingPlaces.length;
  const isFavoritesPage =
    location.pathname === "/favorites" || location.pathname === "/favourites";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (sectionId) => {
    setMenuOpen(false);
    setDropdownOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      if (sectionId) {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleOpenFavorites = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/favorites");
    window.scrollTo(0, 0);
  };

  const handleSelectRegion = (reg) => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/tourist-places", { state: reg });
    window.scrollTo(0, 0);
  };

  const handleSelectPlace = (place, reg) => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate(`/tourist-places/${place.slug}`, {
      state: { place, region: reg },
    });
    window.scrollTo(0, 0);
  };

  return (
    <nav className="glass-navbar sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all duration-300">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick(null)}
          className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#041d15]/85 backdrop-blur-md rounded-[14px] flex items-center justify-center">
              <FaGlobeAmericas className="text-orange-400 text-2xl group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold text-xl lg:text-2xl tracking-tight leading-none">
              India{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-400">
                Explorer
              </span>
            </h2>
            <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-200/70 font-medium block mt-1">
              Incredible Bharat
            </span>
          </div>
        </button>

        {/* Desktop Menu & Global Search */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
          <button
            type="button"
            onClick={() => handleNavClick(null)}
            className="text-emerald-50/90 hover:text-white text-sm lg:text-base font-medium px-3.5 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/15 transition-all duration-300 cursor-pointer"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("explore-map")}
            className="text-emerald-50/90 hover:text-white text-sm lg:text-base font-medium px-3.5 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/15 transition-all duration-300 cursor-pointer"
          >
            Map
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("states")}
            className="text-emerald-50/90 hover:text-white text-sm lg:text-base font-medium px-3.5 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/15 transition-all duration-300 cursor-pointer"
          >
            Explore
          </button>


          <button
            type="button"
            onClick={handleOpenFavorites}
            className={`text-sm lg:text-base font-medium px-3.5 py-2 rounded-full border flex items-center gap-2 transition-all duration-300 cursor-pointer ${
              isFavoritesPage
                ? "bg-white/15 border-orange-400/50 text-orange-300 shadow-md"
                : "text-emerald-50/90 hover:text-orange-300 hover:bg-white/10 border-transparent hover:border-white/15"
            }`}
          >
            <FaHeart className="text-rose-400 text-sm" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Frosted Glass Global Search Input + Live Results Dropdown */}
          <div ref={searchContainerRef} className="relative flex items-center ml-2">
            <IoSearch className="absolute left-3.5 text-orange-300/90 text-lg pointer-events-none" />

            <input
              onFocus={() => setDropdownOpen(true)}
              onChange={(e) => {
                setSearchText(e.target.value);
                setDropdownOpen(true);
              }}
              value={searchText}
              aria-label="Global destination search"
              className="glass-input w-[230px] lg:w-[290px] h-10 pl-10 pr-8 rounded-full text-sm text-white placeholder:text-emerald-100/55 outline-none transition-all duration-300"
              type="text"
              placeholder="Search states, places, cities..."
            />

            {searchText && (
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setDropdownOpen(false);
                }}
                aria-label="Clear search"
                className="absolute right-3 text-white/60 hover:text-white text-base cursor-pointer"
              >
                <IoClose />
              </button>
            )}

            {/* Live Global Search Popover */}
            {dropdownOpen && searchText.trim() !== "" && (
              <div className="search-dropdown absolute top-12 right-0 w-[360px] sm:w-[420px] max-h-[75vh] overflow-y-auto rounded-3xl p-4 z-[100]">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/15 px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                    Global Search ({totalMatches} {totalMatches === 1 ? "match" : "matches"})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchText("");
                      setDropdownOpen(false);
                    }}
                    className="text-xs text-slate-200 hover:text-white focus-visible:text-white focus-visible:underline outline-none cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                {totalMatches > 0 ? (
                  <div className="space-y-4">
                    {/* Matching States / Union Territories */}
                    {matchingRegions.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 px-2 mb-1.5">
                          States &amp; Union Territories ({matchingRegions.length})
                        </p>
                        <div className="space-y-1.5">
                          {matchingRegions.slice(0, 4).map((reg) => (
                            <button
                              key={`nav-reg-${reg.id}`}
                              type="button"
                              onClick={() => handleSelectRegion(reg)}
                              className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange-400/80 outline-none transition text-left cursor-pointer group"
                            >
                              <img
                                src={reg.image || DESTINATION_FALLBACK_IMAGE}
                                alt={reg.state}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                                }}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white group-hover:text-orange-300 group-focus-visible:text-orange-300 truncate">
                                  {reg.state}
                                </p>
                                <p className="text-xs text-slate-200 truncate">
                                  Capital: {reg.capital} • 6 Destinations
                                </p>
                              </div>
                              <span className="text-[10px] font-semibold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-orange-300 shrink-0">
                                {reg.type === "union-territory" ? "UT" : "State"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Tourist Places */}
                    {matchingPlaces.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 px-2 mb-1.5">
                          Tourist Destinations ({matchingPlaces.length})
                        </p>
                        <div className="space-y-1.5">
                          {matchingPlaces.slice(0, 6).map(({ place, region }) => (
                            <button
                              key={`nav-place-${place.slug}`}
                              type="button"
                              onClick={() => handleSelectPlace(place, region)}
                              className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange-400/80 outline-none transition text-left cursor-pointer group"
                            >
                              <img
                                src={place.image || DESTINATION_FALLBACK_IMAGE}
                                alt={place.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                                }}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white group-hover:text-orange-300 group-focus-visible:text-orange-300 truncate">
                                  {place.name}
                                </p>
                                <p className="text-xs text-slate-200 flex items-center gap-1 truncate">
                                  <FaLocationDot className="text-orange-400 shrink-0 text-[10px]" />
                                  <span className="truncate">
                                    {place.city}, {region.state}
                                  </span>
                                </p>
                              </div>
                              {place.category && (
                                <span className="text-[10px] font-medium bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full text-slate-100 shrink-0">
                                  {place.category}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleNavClick("states")}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 focus-visible:ring-2 focus-visible:ring-white outline-none text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <span>View All {totalMatches} Results in Explorer</span>
                      <FaArrowRight className="text-[10px]" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8 px-4 text-center">
                    <p className="text-sm font-bold text-white mb-1">
                      No destinations found
                    </p>
                    <p className="text-xs text-slate-200 mb-4">
                      No states, Union Territories, or tourist places matched &ldquo;{searchText}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchText("")}
                      className="bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-orange-400 border border-white/20 text-orange-300 px-4 py-1.5 rounded-full text-xs font-semibold outline-none cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden glass-pill p-2.5 rounded-xl text-white text-2xl hover:bg-white/15 transition"
        >
          {menuOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Frosted Glass Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 glass-panel rounded-3xl p-5 flex flex-col items-center gap-3 border border-white/20">
          <button
            type="button"
            onClick={() => handleNavClick(null)}
            className="w-full text-center py-2.5 rounded-xl text-white font-medium hover:bg-white/10 transition"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("explore-map")}
            className="w-full text-center py-2.5 rounded-xl text-white font-medium hover:bg-white/10 transition"
          >
            Interactive Map
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("states")}
            className="w-full text-center py-2.5 rounded-xl text-white font-medium hover:bg-white/10 transition"
          >
            Explore &amp; Filter
          </button>


          <button
            type="button"
            onClick={handleOpenFavorites}
            className="w-full py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition"
          >
            <FaHeart className="text-rose-400" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow">
                {favoritesCount}
              </span>
            )}
          </button>

          <div className="relative flex items-center w-full mt-2">
            <IoSearch className="absolute left-4 text-orange-300 text-lg pointer-events-none" />

            <input
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              value={searchText}
              aria-label="Mobile global search"
              className="glass-input w-full h-11 pl-11 pr-9 rounded-full text-sm text-white placeholder:text-emerald-100/60 outline-none transition duration-300"
              type="text"
              placeholder="Search states, places, cities..."
            />

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
                className="absolute right-3.5 text-white/60 hover:text-white text-base"
              >
                <IoClose />
              </button>
            )}
          </div>

          {/* Mobile Live Search Results */}
          {searchText.trim() !== "" && (
            <div className="search-dropdown w-full max-h-64 overflow-y-auto mt-2 p-3 rounded-2xl space-y-2 z-[100]">
              {totalMatches > 0 ? (
                <>
                  {matchingRegions.slice(0, 3).map((reg) => (
                    <button
                      key={`mob-reg-${reg.id}`}
                      type="button"
                      onClick={() => handleSelectRegion(reg)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange-400/80 outline-none text-left group"
                    >
                      <img
                        src={reg.image || DESTINATION_FALLBACK_IMAGE}
                        alt={reg.state}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                        }}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white group-hover:text-orange-300 group-focus-visible:text-orange-300 truncate">
                          {reg.state}
                        </p>
                        <p className="text-xs text-slate-200 truncate">
                          {reg.type === "union-territory" ? "Union Territory" : "State"} • {reg.capital}
                        </p>
                      </div>
                    </button>
                  ))}
                  {matchingPlaces.slice(0, 5).map(({ place, region }) => (
                    <button
                      key={`mob-place-${place.slug}`}
                      type="button"
                      onClick={() => handleSelectPlace(place, region)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-orange-400/80 outline-none text-left group"
                    >
                      <img
                        src={place.image || DESTINATION_FALLBACK_IMAGE}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                        }}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white group-hover:text-orange-300 group-focus-visible:text-orange-300 truncate">
                          {place.name}
                        </p>
                        <p className="text-xs text-slate-200 truncate">
                          {place.city}, {region.state}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <p className="text-xs text-center text-slate-200 py-3">
                  No destinations found matching &ldquo;{searchText}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;