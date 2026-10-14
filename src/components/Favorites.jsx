import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaLocationDot,
  FaArrowRight,
  FaArrowLeft,
  FaCompass,
  FaTrashCan,
} from "react-icons/fa6";
import { useFavorites } from "../context/FavoritesContext";
import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

const Favorites = () => {
  const navigate = useNavigate();
  const {
    favoriteDestinations,
    favoritesCount,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  const handleOpenDetail = (place, region) => {
    navigate(`/tourist-places/${place.slug}`, {
      state: { place, region },
    });
    window.scrollTo(0, 0);
  };

  const handleExploreDestinations = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("states")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  return (
    <div className="min-h-screen bg-[#031510] text-white pb-24 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-32 -left-24 w-96 h-96 bg-orange-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Navigation & Header Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2.5 glass-pill hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition cursor-pointer shadow-md"
          >
            <FaArrowLeft className="text-orange-400" />
            <span>Back to Home</span>
          </button>

          {favoritesCount > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex items-center gap-2 glass-pill hover:bg-rose-500/25 hover:border-rose-400/50 text-rose-300 hover:text-white px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer"
            >
              <FaTrashCan className="text-xs" />
              <span>Clear All ({favoritesCount})</span>
            </button>
          )}
        </div>

        {/* Hero Glass Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-[2rem] px-6 py-10 sm:px-12 sm:py-12 text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-orange-300 mb-4">
            <FaHeart className="text-rose-400" />
            <span>
              Personal Travel Wishlist • {favoritesCount}{" "}
              {favoritesCount === 1 ? "Saved Place" : "Saved Places"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Your Favorite{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300">
              Indian Destinations
            </span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-emerald-50/85 text-sm sm:text-base leading-relaxed">
            Keep track of the tourist landmarks, hill stations, beaches, and heritage sites across India&apos;s 28 States and 8 Union Territories that you want to visit next.
          </p>
        </motion.div>

        {/* Favorites Grid or Friendly Empty State */}
        {favoritesCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {favoriteDestinations.map(({ place, region }) => {
                const placeKey = place.slug || place.id;
                const favorited = isFavorite(placeKey);
                const isUT = region.type === "union-territory";

                return (
                  <motion.div
                    key={placeKey}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleOpenDetail(place, region)}
                    className="group glass-card rounded-[1.85rem] overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={place.image || DESTINATION_FALLBACK_IMAGE}
                          alt={`${place.name} in ${region.state}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/30 to-transparent" />

                        {/* State / Union Territory Location Pill */}
                        <div className="absolute top-3.5 left-3.5 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-white shadow-md max-w-[75%]">
                          <FaLocationDot className="text-orange-400 shrink-0" />
                          <span className="truncate">
                            {place.city}, {region.state}
                          </span>
                        </div>

                        {/* Heart Favorite Toggle Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(placeKey);
                          }}
                          aria-label={
                            favorited
                              ? `Remove ${place.name} from favorites`
                              : `Add ${place.name} to favorites`
                          }
                          aria-pressed={favorited}
                          title={
                            favorited
                              ? "Remove from Favorites"
                              : "Save to Favorites"
                          }
                          className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg ${
                            favorited
                              ? "bg-rose-500/90 text-white border border-rose-300/60 hover:bg-rose-600 scale-105"
                              : "glass-pill text-white/85 hover:text-rose-400 hover:bg-white/20"
                          }`}
                        >
                          {favorited ? (
                            <FaHeart className="text-base drop-shadow" />
                          ) : (
                            <FaRegHeart className="text-base" />
                          )}
                        </button>

                        {/* Region Type + Category Pill */}
                        <div className="absolute bottom-12 left-5 right-5 flex flex-wrap items-center gap-2">
                          <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-orange-300">
                            {isUT ? "Union Territory" : "State"}: {region.state}
                          </span>
                          {place.category && (
                            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-medium text-emerald-100">
                              {place.category}
                            </span>
                          )}
                        </div>

                        {/* Destination Name */}
                        <h2 className="absolute bottom-3 left-5 right-5 text-white text-2xl font-bold tracking-tight group-hover:text-orange-300 transition-colors drop-shadow-md truncate">
                          {place.name}
                        </h2>
                      </div>

                      {/* Description */}
                      <div className="p-6 pt-4">
                        <p className="text-emerald-50/80 text-sm leading-relaxed line-clamp-3">
                          {place.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Explore Detail & Remove Button */}
                    <div className="px-6 pb-6 pt-1 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(place, region);
                        }}
                        className="flex-1 flex items-center justify-between glass-pill hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:border-orange-400 text-white py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer group/btn"
                      >
                        <span className="truncate mr-2">Explore {place.name}</span>
                        <span className="w-7 h-7 rounded-lg bg-white/10 group-hover/btn:bg-white/20 flex items-center justify-center shrink-0">
                          <FaArrowRight className="text-xs text-orange-300 group-hover/btn:text-white" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(placeKey);
                        }}
                        aria-label={`Remove ${place.name} from favorites`}
                        title="Remove from Favorites"
                        className="glass-pill hover:bg-rose-500/25 hover:border-rose-400/50 text-rose-300 hover:text-white p-3.5 rounded-2xl transition-all duration-300 cursor-pointer shrink-0"
                      >
                        <FaTrashCan className="text-sm" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Friendly Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto glass-panel rounded-3xl p-10 sm:p-12 text-center my-8"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl glass-pill flex items-center justify-center text-rose-400 text-3xl shadow-lg">
              <FaRegHeart />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Your Travel Wishlist is Empty
            </h2>

            <p className="text-emerald-100/75 text-sm sm:text-base leading-relaxed mb-8">
              You haven&apos;t saved any favorite destinations yet. Click the heart icon on any tourist place card or destination guide to build your personal India travel wishlist!
            </p>

            <button
              type="button"
              onClick={handleExploreDestinations}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-7 py-3.5 rounded-2xl font-semibold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all duration-300 cursor-pointer"
            >
              <FaCompass className="text-lg" />
              <span>Explore Destinations</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
