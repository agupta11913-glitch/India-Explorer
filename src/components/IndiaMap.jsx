import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot, FaArrowRight, FaMapLocationDot } from "react-icons/fa6";
import states from "../data/state";
import indiaMapData from "../data/indiaMapData";
import india from "@svg-maps/india";
import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

const unionTerritoryKeys = ["jk", "la", "dl", "ch", "dn", "py", "an", "ld"];

const IndiaMap = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState("rj"); // Default highlight on Rajasthan

  // Helper to find existing state/UT data for a region
  const getStateData = (regionId) => {
    const mapInfo = indiaMapData[regionId];
    if (!mapInfo || !mapInfo.stateId) return null;
    return states.find((s) => s.id === mapInfo.stateId) || null;
  };

  const handleStateClick = (regionId) => {
    const mapInfo = indiaMapData[regionId];
    if (!mapInfo) return;

    setSelectedId(regionId);

    if (mapInfo.stateId) {
      const stateObj = states.find((s) => s.id === mapInfo.stateId);
      if (stateObj) {
        navigate("/tourist-places", { state: stateObj });
        window.scrollTo(0, 0);
      }
    }
  };

  const activeRegionId = hoveredId || selectedId;
  const activeStateData = activeRegionId ? getStateData(activeRegionId) : null;
  const activeMapInfo = activeRegionId ? indiaMapData[activeRegionId] : null;

  return (
    <section
      id="explore-map"
      className="relative py-20 px-4 bg-[#031510] overflow-hidden"
    >
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-[420px] h-[420px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-orange-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-orange-300 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-4">
            <FaMapLocationDot className="text-orange-400 text-base" />
            <span>Interactive Geography • 28 States &amp; 8 UTs</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Explore India by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300">
              Interactive Map
            </span>
          </h2>

          <p className="text-emerald-100/75 mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Hover over or click any State or Union Territory across the subcontinent to preview its capital, top landmarks, and open its destination guide.
          </p>
        </div>

        {/* Main Grid: Map & Frosted Glass Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SVG Map Frosted Container */}
          <div className="lg:col-span-8 flex flex-col items-center relative">
            <div className="relative w-full max-w-[650px] glass-panel p-4 sm:p-8 rounded-[2rem]">
              {/* Map Guide Pill */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 text-xs font-medium text-emerald-50/90 glass-pill px-3.5 py-1.5 rounded-full shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
                <span>Click any State or UT to explore</span>
              </div>

              {/* SVG Map */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={india.viewBox}
                aria-label="Interactive Map of India"
                className="w-full h-auto max-h-[700px] select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
              >
                <defs>
                  <filter id="state-glow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#f97316" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* State & UT Paths */}
                <g className="india-states-layer">
                  {india.locations.map((location) => {
                    const regionId = location.id;
                    const mapInfo = indiaMapData[regionId];
                    const isClickable = Boolean(mapInfo?.stateId);
                    const isHovered = hoveredId === regionId;
                    const isSelected = selectedId === regionId;

                    let fillClass = "fill-emerald-400/20";
                    let strokeClass = "stroke-emerald-200/45";

                    if (mapInfo?.isUnionTerritory) {
                      fillClass = "fill-teal-300/30";
                      strokeClass = "stroke-amber-300/60";
                    }

                    if (isSelected) {
                      fillClass = "fill-orange-500/90";
                      strokeClass = "stroke-amber-200";
                    } else if (isHovered) {
                      fillClass = "fill-orange-400/85";
                      strokeClass = "stroke-white";
                    }

                    return (
                      <path
                        key={regionId}
                        id={regionId}
                        d={location.path}
                        className={`transition-all duration-200 ${fillClass} ${strokeClass} stroke-[1.1] ${
                          isClickable ? "cursor-pointer hover:stroke-[1.8]" : "cursor-default"
                        }`}
                        filter={isHovered || isSelected ? "url(#state-glow)" : undefined}
                        onMouseEnter={() => {
                          setHoveredId(regionId);
                        }}
                        onMouseLeave={() => {
                          setHoveredId(null);
                        }}
                        onClick={() => handleStateClick(regionId)}
                      >
                        <title>{mapInfo?.label || location.name}</title>
                      </path>
                    );
                  })}

                  {/* Interactive Hotspot for Ladakh (Eastern Crown) */}
                  <g
                    id="la"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredId("la")}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleStateClick("la")}
                  >
                    <title>Ladakh (Union Territory)</title>
                    <circle
                      cx={indiaMapData.la.x}
                      cy={indiaMapData.la.y}
                      r="22"
                      className={`transition-all duration-200 ${
                        hoveredId === "la" || selectedId === "la"
                          ? "fill-orange-500/85 stroke-amber-200 stroke-[1.8]"
                          : "fill-teal-300/25 stroke-amber-300/60 stroke-[1.2] hover:fill-orange-400/80"
                      }`}
                    />
                  </g>
                </g>

                {/* State & UT SVG Text Labels */}
                <g className="india-labels-layer pointer-events-none select-none">
                  {Object.entries(indiaMapData).map(([regionId, mapInfo]) => {
                    if (!mapInfo || !mapInfo.x || !mapInfo.y) return null;

                    const isHovered = hoveredId === regionId;
                    const isSelected = selectedId === regionId;
                    const isHighlight = isHovered || isSelected;
                    const labelText = mapInfo.shortLabel || mapInfo.label;

                    return (
                      <text
                        key={`label-${regionId}`}
                        x={mapInfo.x}
                        y={mapInfo.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`tracking-tight transition-all duration-200 ${
                          isHighlight
                            ? "fill-white font-bold"
                            : "fill-emerald-50 font-semibold opacity-95"
                        }`}
                        style={{
                          fontSize:
                            labelText.length > 10
                              ? "8px"
                              : labelText.length > 7
                              ? "8.5px"
                              : "9.5px",
                          paintOrder: "stroke fill",
                          stroke: isHighlight ? "#9a3412" : "#022c22",
                          strokeWidth: isHighlight ? "2.6px" : "2.2px",
                          strokeLinejoin: "round",
                        }}
                      >
                        {labelText}
                      </text>
                    );
                  })}
                </g>
              </svg>

              {/* Quick-Select Union Territories Bar (for small coastal/island UTs) */}
              <div className="mt-5 pt-4 border-t border-white/15">
                <p className="text-[11px] uppercase tracking-[0.18em] text-orange-300 font-semibold mb-2.5 text-center">
                  Quick Access: 8 Union Territories
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {unionTerritoryKeys.map((utKey) => {
                    const utInfo = indiaMapData[utKey];
                    const isActive = activeRegionId === utKey;
                    return (
                      <button
                        key={utKey}
                        type="button"
                        onMouseEnter={() => setHoveredId(utKey)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleStateClick(utKey)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                            : "glass-pill text-emerald-50/90 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        {utInfo.shortLabel === "CH"
                          ? "Chandigarh"
                          : utInfo.shortLabel === "J&K"
                          ? "Jammu & Kashmir"
                          : utInfo.shortLabel === "DNH & DD"
                          ? "Daman & Diu / DNH"
                          : utInfo.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Active State / UT Details Frosted Glass Card */}
          <div className="lg:col-span-4 w-full">
            <AnimatePresence mode="wait">
              {activeStateData ? (
                <motion.div
                  key={activeStateData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel rounded-[2rem] overflow-hidden transition-all duration-300"
                >
                  {/* State Image Banner */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={activeStateData.image || DESTINATION_FALLBACK_IMAGE}
                      alt={activeStateData.state}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DESTINATION_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/30 to-transparent" />

                    {/* Top Floating Glass Capital Badge */}
                    <div className="absolute top-4 right-4 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-white shadow-lg">
                      <FaLocationDot className="text-orange-400" />
                      <span>{activeStateData.capital}</span>
                    </div>

                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-orange-300 glass-pill px-3 py-1 rounded-full">
                        {activeStateData.type === "union-territory"
                          ? "Union Territory"
                          : "Featured State"}
                      </span>
                      <h3 className="text-3xl font-bold mt-2 drop-shadow-md">
                        {activeStateData.state}
                      </h3>
                    </div>
                  </div>

                  {/* State Content */}
                  <div className="p-6 pt-4">
                    {/* Description */}
                    <p className="text-emerald-50/80 text-sm leading-relaxed line-clamp-3 mb-6">
                      {activeStateData.description}
                    </p>

                    {/* Top Tourist Places Preview */}
                    {activeStateData.touristPlaces && (
                      <div className="mb-6">
                        <span className="text-[11px] font-semibold text-emerald-200/60 uppercase tracking-[0.18em]">
                          6 Iconic Destinations (Click to view)
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {activeStateData.touristPlaces.map((place, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                navigate(`/tourist-places/${place.slug}`, {
                                  state: { place, region: activeStateData },
                                });
                                window.scrollTo(0, 0);
                              }}
                              className="text-xs font-medium glass-pill hover:bg-orange-500/30 hover:border-orange-400/50 text-emerald-50 hover:text-white px-3 py-1.5 rounded-full transition cursor-pointer"
                            >
                              {place.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Explore Now Button */}
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/tourist-places", { state: activeStateData });
                        window.scrollTo(0, 0);
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white py-3.5 px-6 rounded-2xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 cursor-pointer group"
                    >
                      <span>Explore {activeStateData.state}</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-panel rounded-[2rem] p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-pill flex items-center justify-center text-orange-400 text-2xl">
                    <FaMapLocationDot />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {activeMapInfo?.label || "Select a State or UT"}
                  </h3>
                  <p className="text-emerald-100/75 text-sm leading-relaxed mb-5">
                    Click or tap any of the 28 States or 8 Union Territories on the map to explore its 6 famous tourist destinations.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndiaMap;
