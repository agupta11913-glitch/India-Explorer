import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLocationDot,
  FaArrowLeft,
  FaArrowRight,
  FaCompass,
  FaMapLocationDot,
  FaCalendarDays,
  FaClock,
  FaTicket,
  FaLightbulb,
  FaImages,
  FaExpand,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import states from "../data/state";
import { useFavorites } from "../context/FavoritesContext";
import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

function findDestination(slug, routerState) {
  for (const reg of states) {
    const found = reg.touristPlaces?.find(
      (p) => p.slug === slug || p.id === slug
    );
    if (found) {
      return { place: found, region: reg };
    }
  }
  if (routerState?.place && routerState?.region) {
    return {
      place: routerState.place,
      region: routerState.region,
    };
  }
  return { place: null, region: null };
}

const TouristPlaceDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { place, region } = findDestination(slug, location.state);

  const [gallerySelection, setGallerySelection] = useState({
    slug: null,
    image: null,
  });
  const [loadedImageKey, setLoadedImageKey] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!place || !region) {
    return (
      <div className="min-h-[85vh] bg-[#031510] flex items-center justify-center px-4">
        <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-orange-300 mb-3">
            Destination Not Found
          </h1>
          <p className="text-emerald-100/75 text-sm mb-6">
            We couldn&apos;t find a tourist destination matching &ldquo;{slug}&rdquo;. Please return to the directory to explore all 216 destinations across India.
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

  const isUT = region.type === "union-territory";
  const galleryImages =
    Array.isArray(place.gallery) && place.gallery.length > 0
      ? place.gallery
      : [place.image, region.image].filter(Boolean);

  const currentHeroImage =
    gallerySelection.slug === place.slug && gallerySelection.image
      ? gallerySelection.image
      : place.image;

  const heroLoaded = loadedImageKey === `${place.slug}:${currentHeroImage}`;

  const relatedPlaces = (region.touristPlaces || []).filter(
    (p) => p.slug !== place.slug
  );

  const googleMapsUrl =
    place.location || place.city
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${place.name}, ${place.location || `${place.city}, ${region.state}`}, India`
        )}`
      : null;

  const handleBackToDestinations = () => {
    navigate("/tourist-places", { state: region });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#031510] text-white pb-24 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-64 -left-24 w-[420px] h-[420px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-32 -right-24 w-[420px] h-[420px] bg-orange-500/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Large Hero Banner */}
      <div className="relative h-[440px] sm:h-[520px] overflow-hidden flex items-end">
        {/* Loading Skeleton */}
        {!heroLoaded && (
          <div className="absolute inset-0 bg-emerald-950/60 animate-pulse" />
        )}

        <img
          src={currentHeroImage || DESTINATION_FALLBACK_IMAGE}
          alt={`${place.name} in ${region.state}`}
          referrerPolicy="no-referrer"
          onLoad={() => setLoadedImageKey(`${place.slug}:${currentHeroImage}`)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
            setLoadedImageKey(`${place.slug}:${currentHeroImage}`);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            heroLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />

        {/* Multi-layer Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/55 to-[#031510]/40" />

        {/* Top Navigation & Breadcrumb Bar Over Hero */}
        <div className="absolute top-6 left-0 right-0 z-20 max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackToDestinations}
            className="inline-flex items-center gap-2.5 glass-pill hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition cursor-pointer shadow-lg"
          >
            <FaArrowLeft className="text-orange-400" />
            <span>Back to {region.state} Destinations</span>
          </button>

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-2 text-xs glass-pill px-4 py-2 rounded-full text-emerald-100/85"
          >
            <Link to="/" className="hover:text-orange-300 transition">
              Home
            </Link>
            <span>/</span>
            <button
              type="button"
              onClick={handleBackToDestinations}
              className="hover:text-orange-300 transition cursor-pointer"
            >
              {region.state}
            </button>
            <span>/</span>
            <span className="text-orange-300 font-semibold">{place.name}</span>
          </nav>
        </div>

        {/* Hero Title & Location Content */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              {place.category && (
                <span className="glass-pill px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
                  {place.category}
                </span>
              )}
              <span className="glass-pill px-3.5 py-1 rounded-full text-xs font-medium text-emerald-100">
                {isUT ? "Union Territory" : "State"}: {region.state}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {place.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-50/95 text-sm sm:text-base font-medium drop-shadow">
                <FaLocationDot className="text-orange-400 text-lg shrink-0" />
                <span>{place.location || `${place.city}, ${region.state}`}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleFavorite(place.slug || place.id)}
                  aria-label={
                    isFavorite(place.slug || place.id)
                      ? `Remove ${place.name} from favorites`
                      : `Add ${place.name} to favorites`
                  }
                  aria-pressed={isFavorite(place.slug || place.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg ${
                    isFavorite(place.slug || place.id)
                      ? "bg-rose-500/90 hover:bg-rose-600 text-white border border-rose-300/60"
                      : "glass-pill hover:bg-white/20 text-white"
                  }`}
                >
                  {isFavorite(place.slug || place.id) ? (
                    <>
                      <FaHeart className="text-white text-sm" />
                      <span>Saved in Favorites</span>
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="text-rose-400 text-sm" />
                      <span>Add to Favorites</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="inline-flex items-center gap-2 glass-pill hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  <FaExpand className="text-orange-300" />
                  <span>View Full Photo</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Overview, Description, Photo Gallery & Tips */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-[2rem] p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-orange-300 text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              <FaCompass className="text-orange-400" />
              <span>Destination Overview</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              About {place.name}
            </h2>

            <p className="text-emerald-50/90 text-base sm:text-lg leading-relaxed">
              {place.description}
            </p>

            <p className="text-emerald-100/75 text-sm sm:text-base leading-relaxed mt-4 pt-4 border-t border-white/10">
              Located in <strong className="text-white">{place.city}</strong> within{" "}
              <strong className="text-white">{region.state}</strong> (Capital:{" "}
              {region.capital}), {place.name} is one of the region&apos;s six signature
              tourist landmarks celebrated for its cultural and natural appeal.
            </p>
          </motion.div>

          {/* Photo Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-[2rem] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 text-orange-300 text-xs font-semibold uppercase tracking-[0.18em] mb-1">
                  <FaImages className="text-orange-400" />
                  <span>Visual Showcase</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Photo Gallery
                </h2>
              </div>
              <span className="text-xs glass-pill px-3 py-1 rounded-full text-emerald-100/80">
                Click any photo to preview
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((imgUrl, idx) => {
                const isCurrent = currentHeroImage === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setGallerySelection({ slug: place.slug, image: imgUrl })
                    }
                    className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? "border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.45)] scale-[1.02]"
                        : "border-white/15 hover:border-white/40 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl || DESTINATION_FALLBACK_IMAGE}
                      alt={`${place.name} gallery view ${idx + 1}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Travel Tips Section (Rendered when available) */}
          {Array.isArray(place.travelTips) && place.travelTips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel rounded-[2rem] p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-orange-300 text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                <FaLightbulb className="text-orange-400" />
                <span>Visitor Guidance</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-5">
                Essential Travel Tips for {place.name}
              </h2>

              <ul className="space-y-3.5">
                {place.travelTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3.5 glass-pill p-4 rounded-2xl text-sm sm:text-base text-emerald-50/90"
                  >
                    <span className="w-6 h-6 rounded-full bg-orange-500/25 border border-orange-400/50 text-orange-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right Column: Visitor Information & Google Maps */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-panel rounded-[2rem] p-6 sm:p-7 space-y-5"
          >
            <h3 className="text-xl font-bold text-white border-b border-white/15 pb-3">
              Travel Information
            </h3>

            {/* Location */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-orange-400 shrink-0">
                <FaLocationDot />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-200/60 font-semibold">
                  Location
                </p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {place.location || `${place.city}, ${region.state}`}
                </p>
              </div>
            </div>

            {/* Best Time to Visit (only when available) */}
            {place.bestTimeToVisit && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-orange-400 shrink-0">
                  <FaCalendarDays />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-200/60 font-semibold">
                    Best Time to Visit
                  </p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {place.bestTimeToVisit}
                  </p>
                </div>
              </div>
            )}

            {/* Visiting Hours (only when verified & available) */}
            {place.visitingHours && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-orange-400 shrink-0">
                  <FaClock />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-200/60 font-semibold">
                    Visiting Hours
                  </p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {place.visitingHours}
                  </p>
                </div>
              </div>
            )}

            {/* Entry Fees (only when verified & available) */}
            {place.entryFees && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-orange-400 shrink-0">
                  <FaTicket />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-200/60 font-semibold">
                    Entry Fee Info
                  </p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {place.entryFees}
                  </p>
                </div>
              </div>
            )}

            {/* Honest Advisory Note when exact hours/tariffs are not hardcoded */}
            {(!place.visitingHours || !place.entryFees) && (
              <div className="glass-pill rounded-2xl p-3.5 text-xs text-emerald-100/75 leading-relaxed">
                Note: Monument timings and ticket tariffs are subject to seasonal and state tourism board updates. Please verify current on-site timings prior to arrival.
              </div>
            )}

            {/* Google Maps CTA */}
            {googleMapsUrl && (
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all duration-300 cursor-pointer"
                >
                  <FaMapLocationDot className="text-base" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            )}

            {/* Save / Remove Favorite CTA */}
            <button
              type="button"
              onClick={() => toggleFavorite(place.slug || place.id)}
              aria-pressed={isFavorite(place.slug || place.id)}
              className={`w-full inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                isFavorite(place.slug || place.id)
                  ? "bg-rose-500/90 hover:bg-rose-600 text-white border border-rose-300/60 shadow-lg shadow-rose-500/20"
                  : "glass-pill hover:bg-white/20 text-white"
              }`}
            >
              {isFavorite(place.slug || place.id) ? (
                <>
                  <FaHeart className="text-white text-sm" />
                  <span>Saved in Favorites (Remove)</span>
                </>
              ) : (
                <>
                  <FaRegHeart className="text-rose-400 text-sm" />
                  <span>Save to Favorites</span>
                </>
              )}
            </button>


            {/* Back to Region Button */}
            <button
              type="button"
              onClick={handleBackToDestinations}
              className="w-full inline-flex items-center justify-center gap-2 glass-pill hover:bg-white/20 text-white py-3 px-5 rounded-2xl font-semibold text-sm transition cursor-pointer"
            >
              <FaArrowLeft className="text-orange-400 text-xs" />
              <span>All {region.state} Places</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Related Places in the Same State / Union Territory */}
      {relatedPlaces.length > 0 && (
        <div className="relative z-10 max-w-6xl mx-auto px-6 mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                Continue Exploring {region.state}
              </span>
              <h2 className="text-3xl font-bold text-white mt-1">
                More Places in {region.state}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleBackToDestinations}
              className="self-start sm:self-auto inline-flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200 font-semibold cursor-pointer"
            >
              <span>View all 6 destinations</span>
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {relatedPlaces.map((relPlace) => {
              const relKey = relPlace.slug || relPlace.id;
              const relFavorited = isFavorite(relKey);

              return (
                <motion.div
                  key={relKey}
                  whileHover={{ y: -8 }}
                  onClick={() =>
                    navigate(`/tourist-places/${relPlace.slug}`, {
                      state: { place: relPlace, region },
                    })
                  }
                  className="group glass-card rounded-[1.85rem] overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={relPlace.image || DESTINATION_FALLBACK_IMAGE}
                        alt={`${relPlace.name} in ${region.state}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/25 to-transparent" />

                      <div className="absolute top-3.5 left-3.5 glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold text-white max-w-[75%]">
                        <FaLocationDot className="text-orange-400 shrink-0" />
                        <span className="truncate">{relPlace.city}</span>
                      </div>

                      {/* Heart Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(relKey);
                        }}
                        aria-label={
                          relFavorited
                            ? `Remove ${relPlace.name} from favorites`
                            : `Add ${relPlace.name} to favorites`
                        }
                        aria-pressed={relFavorited}
                        title={
                          relFavorited
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                        className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg ${
                          relFavorited
                            ? "bg-rose-500/90 text-white border border-rose-300/60 hover:bg-rose-600 scale-105"
                            : "glass-pill text-white/85 hover:text-rose-400 hover:bg-white/20"
                        }`}
                      >
                        {relFavorited ? (
                          <FaHeart className="text-sm drop-shadow" />
                        ) : (
                          <FaRegHeart className="text-sm" />
                        )}
                      </button>

                      <h3 className="absolute bottom-3 left-5 right-5 text-white text-xl font-bold group-hover:text-orange-300 transition-colors drop-shadow-md truncate">
                        {relPlace.name}
                      </h3>
                    </div>

                    <div className="p-5 pt-4">
                      <p className="text-emerald-50/80 text-sm leading-relaxed line-clamp-2">
                        {relPlace.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-1">
                    <div className="w-full flex items-center justify-between glass-pill group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 text-white py-2.5 px-4 rounded-xl font-semibold text-xs transition-all duration-300">
                      <span>View {relPlace.name}</span>
                      <FaArrowRight className="text-xs" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen Image Viewer */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close full image"
              className="absolute top-6 right-6 w-11 h-11 rounded-full glass-pill hover:bg-white/25 flex items-center justify-center text-white text-2xl cursor-pointer"
            >
              <IoClose />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={currentHeroImage || DESTINATION_FALLBACK_IMAGE}
              alt={place.name}
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
              }}
              className="max-w-5xl max-h-[85vh] w-auto h-auto rounded-3xl shadow-2xl border border-white/20 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TouristPlaceDetail;
