import { FaLocationDot } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

const Statecard = ({ state }) => {
  const navigate = useNavigate();
  const isUT = state.type === "union-territory";

  return (
    <motion.div
      id={`state-${state.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      viewport={{ once: false, amount: 0.2 }}
      className="group glass-card w-full sm:w-[360px] rounded-[1.85rem] overflow-hidden hover:-translate-y-2.5 flex flex-col justify-between"
    >
      <div>
        {/* Image Header */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={state.image || DESTINATION_FALLBACK_IMAGE}
            alt={state.state}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/25 to-transparent" />

          {/* Floating Frosted Capital Badge */}
          <div className="absolute top-3.5 left-3.5 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-white shadow-md">
            <FaLocationDot className="text-orange-400" />
            <span>{state.capital}</span>
          </div>

          {/* Region Type & Destination Count Glass Badge */}
          <div
            className={`absolute top-3.5 right-3.5 glass-pill px-3 py-1 rounded-full text-[11px] font-semibold ${
              isUT ? "text-amber-300 border-amber-400/40" : "text-emerald-100"
            }`}
          >
            {isUT ? "UT" : "State"} • {state.touristPlaces?.length || 6} Places
          </div>

          {/* State / UT Name on Image Bottom */}
          <div className="absolute bottom-3 left-5 right-5">
            <h2 className="text-white text-2xl font-bold tracking-tight group-hover:text-orange-300 transition-colors duration-300 drop-shadow-md">
              {state.state}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-4">
          <p className="text-emerald-50/80 text-sm leading-relaxed line-clamp-3">
            {state.description}
          </p>

          {/* Top Highlights Preview Pills */}
          {state.touristPlaces && state.touristPlaces.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {state.touristPlaces.slice(0, 3).map((place) => (
                <button
                  key={place.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tourist-places/${place.slug}`, {
                      state: { place, region: state },
                    });
                    window.scrollTo(0, 0);
                  }}
                  className="text-[11px] glass-pill hover:bg-orange-500/30 hover:border-orange-400/50 px-2.5 py-1 rounded-full text-emerald-100/90 hover:text-white transition cursor-pointer"
                >
                  {place.name}
                </button>
              ))}
              {state.touristPlaces.length > 3 && (
                <span className="text-[11px] glass-pill px-2.5 py-1 rounded-full text-orange-300 font-medium">
                  +{state.touristPlaces.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-6 pb-6 pt-1">
        <button
          type="button"
          onClick={() => {
            navigate("/tourist-places", { state });
            window.scrollTo(0, 0);
          }}
          className="w-full flex items-center justify-between glass-pill hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:border-orange-400 text-white px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer group/btn shadow-md"
        >
          <span>Explore 6 Destinations</span>
          <span className="w-8 h-8 rounded-xl bg-white/10 group-hover/btn:bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
            <FaArrowRight className="text-xs text-orange-300 group-hover/btn:text-white" />
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default Statecard;