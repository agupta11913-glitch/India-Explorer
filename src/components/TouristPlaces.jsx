import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLocationDot,
  FaArrowRight,
  FaArrowLeft,
  FaCompass,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import states from "../data/state";
import { useFavorites } from "../context/FavoritesContext";
import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

const TouristPlaces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Resolve region from router state, URL query param (?region=), or sessionStorage (for browser refresh)
  const state = useMemo(() => {
    if (location.state && location.state.state) {
      // Find canonical up-to-date region object from states array
      return (
        states.find(
          (s) =>
            s.id === location.state.id ||
            s.state === location.state.state
        ) || location.state
      );
    }

    const regionParam = searchParams.get("region");
    if (regionParam) {
      const found = states.find(
        (s) =>
          s.slug === regionParam.toLowerCase() ||
          String(s.id) === regionParam ||
          s.state.toLowerCase() === regionParam.toLowerCase()
      );
      if (found) return found;
    }

    try {
      const savedSlug = sessionStorage.getItem("india_explorer_last_region");
      if (savedSlug) {
        const found = states.find(
          (s) => s.slug === savedSlug || String(s.id) === savedSlug
        );
        if (found) return found;
      }
    } catch {
      // Ignore storage errors
    }

    return null;
  }, [location.state, searchParams]);

  useEffect(() => {
    if (state?.slug) {
      try {
        sessionStorage.setItem("india_explorer_last_region", state.slug);
      } catch {
        // Ignore storage errors
      }
    }
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-[85vh] bg-[#031510] flex items-center justify-center px-4">
        <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-orange-300 mb-3">
            Region Data Not Found
          </h1>
          <p className="text-emerald-100/75 text-sm mb-6">
            Please select a State or Union Territory from the interactive map or directory to explore its 6 tourist destinations.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg cursor-pointer"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  const isUT = state.type === "union-territory";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  const handleOpenPlaceDetail = (place) => {
    navigate(`/tourist-places/${place.slug}`, {
      state: { place, region: state },
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#031510] text-white pb-24 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-96 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Cinematic Hero Banner */}
      <div className="relative h-[400px] sm:h-[440px] overflow-hidden flex items-center justify-center px-4">
        <img
          src={state.image || DESTINATION_FALLBACK_IMAGE}
          alt={state.state}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
          }}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Multi-layered Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#031510]/65 via-[#031510]/55 to-[#031510]"></div>

        {/* Frosted Glass Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 glass-panel rounded-[2rem] px-6 py-8 sm:px-12 sm:py-10 max-w-3xl w-full text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-orange-300 mb-3">
            <span>{isUT ? "Union Territory" : "State"}</span>
            <span>•</span>
            <FaLocationDot className="text-orange-400" />
            <span>Capital: {state.capital}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300">
              {state.state}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-emerald-50/85 text-sm sm:text-base leading-relaxed">
            {state.description}
          </p>
        </motion.div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-6">
        <motion.button
          type="button"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2.5 glass-pill hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition cursor-pointer shadow-md"
        >
          <FaArrowLeft className="text-orange-400" />
          <span>Back to States &amp; UTs</span>
        </motion.button>
      </div>

      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 text-center mt-8 px-5"
      >
        <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-orange-300 mb-3">
          <FaCompass className="text-orange-400" />
          <span>{state.touristPlaces?.length || 6} Top Destinations</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mt-1">
          Places to Visit in {state.state}
        </h2>

        <p className="text-emerald-100/70 mt-3 text-base sm:text-lg">
          Click any destination card below to open its complete travel guide, photo gallery, and visitor information
        </p>
      </motion.div>

      {/* Tourist Frosted Glass Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {state.touristPlaces.map((place) => {
          const placeKey = place.slug || place.id;
          const favorited = isFavorite(placeKey);

          return (
            <motion.div
              key={placeKey || place.name}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              onClick={() => handleOpenPlaceDetail(place)}
              className="group glass-card rounded-[1.85rem] overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={place.image || DESTINATION_FALLBACK_IMAGE}
                    alt={`${place.name} in ${state.state}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                    }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/25 to-transparent"></div>

                  {/* Floating City Glass Pill */}
                  <div className="absolute top-3.5 left-3.5 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-white shadow-md max-w-[75%]">
                    <FaLocationDot className="text-orange-400 shrink-0" />
                    <span className="truncate">{place.city}</span>
                  </div>

                  {/* Heart Favorite Button */}
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
                        : "Add to Favorites"
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

                  {/* Category Pill */}
                  {place.category && (
                    <div className="absolute bottom-12 left-5 glass-pill px-3 py-0.5 rounded-full text-[10px] font-semibold text-orange-300">
                      {place.category}
                    </div>
                  )}

                  {/* Place Name on Image */}
                  <h3 className="absolute bottom-3.5 left-5 right-5 text-white text-2xl font-bold tracking-tight group-hover:text-orange-300 transition-colors drop-shadow-md truncate">
                    {place.name}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-4">
                  <p className="text-emerald-50/80 text-sm leading-relaxed line-clamp-3">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Explore Button */}
              <div className="px-6 pb-6 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPlaceDetail(place);
                  }}
                  className="w-full flex items-center justify-between glass-pill hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:border-orange-400 text-white py-3 px-5 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer group/btn"
                >
                  <span>Explore {place.name}</span>
                  <span className="w-7 h-7 rounded-lg bg-white/10 group-hover/btn:bg-white/20 flex items-center justify-center">
                    <FaArrowRight className="text-xs text-orange-300 group-hover/btn:text-white" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TouristPlaces;