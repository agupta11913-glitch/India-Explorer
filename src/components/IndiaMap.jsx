import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot, FaArrowRight, FaMapLocationDot } from "react-icons/fa6";
import states from "../data/state";
import indiaMapData from "../data/indiaMapData";
import india from "@svg-maps/india";

const IndiaMap = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState("rj"); // Default highlight on Rajasthan

  // Helper to find existing state data for a region
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
    <section id="explore-map" className="py-16 px-4 bg-gradient-to-b from-white via-emerald-50/40 to-emerald-50">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-3">
            <FaMapLocationDot className="text-orange-500 text-base" />
            <span>Interactive Map</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-green-950 tracking-tight">
            Explore India by Map
          </h2>

          <p className="text-slate-600 mt-3 text-lg md:text-xl max-w-2xl mx-auto">
            Click on any state to uncover its famous monuments, rich heritage, and scenic travel destinations.
          </p>
        </div>

        {/* Main Grid: Map & Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* SVG Map Container */}
          <div className="lg:col-span-8 flex justify-center items-center relative">
            <div className="relative w-full max-w-[620px] bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl shadow-xl border border-emerald-100/80">

              {/* Map Guide Instructions */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span>Hover or tap a state to view details</span>
              </div>

              {/* SVG Map */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={india.viewBox}
                aria-label="Interactive Map of India"
                className="w-full h-auto max-h-[720px] select-none"
              >
                <defs>
                  {/* Subtle drop shadow filter for hovered paths */}
                  <filter id="state-shadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* State Paths */}
                <g className="india-states-layer">
                  {india.locations.map((location) => {
                    const regionId = location.id;
                    const mapInfo = indiaMapData[regionId];
                    const isClickable = Boolean(mapInfo?.stateId);
                    const isHovered = hoveredId === regionId;
                    const isSelected = selectedId === regionId;

                    let fillClass = "fill-emerald-100/90";
                    let strokeClass = "stroke-emerald-600/70";

                    if (!isClickable) {
                      fillClass = "fill-slate-200/80";
                      strokeClass = "stroke-slate-400/50";
                    }

                    if (isSelected) {
                      fillClass = "fill-orange-500";
                      strokeClass = "stroke-orange-700";
                    } else if (isHovered) {
                      fillClass = "fill-orange-400";
                      strokeClass = "stroke-orange-600";
                    }

                    return (
                      <path
                        key={regionId}
                        id={regionId}
                        d={location.path}
                        className={`transition-all duration-200 ${fillClass} ${strokeClass} stroke-[1.2] ${
                          isClickable ? "cursor-pointer hover:stroke-[2]" : "cursor-default"
                        }`}
                        filter={isHovered || isSelected ? "url(#state-shadow)" : undefined}
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
                </g>

                {/* State SVG Text Labels */}
                <g className="india-labels-layer pointer-events-none select-none">
                  {india.locations.map((location) => {
                    const regionId = location.id;
                    const mapInfo = indiaMapData[regionId];
                    if (!mapInfo || !mapInfo.x || !mapInfo.y) return null;

                    const isHovered = hoveredId === regionId;
                    const isSelected = selectedId === regionId;
                    const isHighlight = isHovered || isSelected;

                    // Display short label for compact states or full label
                    const labelText = mapInfo.shortLabel || mapInfo.label;

                    return (
                      <text
                        key={`label-${regionId}`}
                        x={mapInfo.x}
                        y={mapInfo.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`font-semibold tracking-tight transition-all duration-200 ${
                          isHighlight
                            ? "fill-white font-bold"
                            : "fill-green-950 font-medium opacity-90"
                        }`}
                        style={{
                          fontSize: labelText.length > 10 ? "8px" : labelText.length > 7 ? "8.5px" : "9.5px",
                          paintOrder: "stroke fill",
                          stroke: isHighlight ? "#c2410c" : "#ffffff",
                          strokeWidth: isHighlight ? "2.5px" : "2px",
                          strokeLinejoin: "round",
                        }}
                      >
                        {labelText}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Active State Details Preview Card */}
          <div className="lg:col-span-4 w-full">
            <AnimatePresence mode="wait">
              {activeStateData ? (
                <motion.div
                  key={activeStateData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-300"
                >
                  {/* State Image Banner */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={activeStateData.image}
                      alt={activeStateData.state}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-black/20" />

                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="text-xs uppercase tracking-wider font-semibold text-orange-400 bg-black/40 px-2.5 py-1 rounded-md">
                        Selected State
                      </span>
                      <h3 className="text-3xl font-bold mt-1">
                        {activeStateData.state}
                      </h3>
                    </div>
                  </div>

                  {/* State Content */}
                  <div className="p-6">
                    {/* Capital */}
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-base mb-3">
                      <FaLocationDot className="text-orange-500 text-lg" />
                      <span>Capital: <strong className="text-green-950 font-semibold">{activeStateData.capital}</strong></span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                      {activeStateData.description}
                    </p>

                    {/* Top Tourist Places Preview */}
                    {activeStateData.touristPlaces && (
                      <div className="mb-6">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Key Attractions
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {activeStateData.touristPlaces.slice(0, 4).map((place, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200/60"
                            >
                              {place.name}
                            </span>
                          ))}
                          {activeStateData.touristPlaces.length > 4 && (
                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                              +{activeStateData.touristPlaces.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Explore Now Button (Reusing existing Statecard navigation) */}
                    <button
                      onClick={() => {
                        navigate("/tourist-places", { state: activeStateData });
                        window.scrollTo(0, 0);
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-green-700 hover:bg-green-800 text-white py-3.5 px-6 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <span>Explore {activeStateData.state}</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-md border border-slate-200 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl">
                    <FaMapLocationDot />
                  </div>
                  <h3 className="text-xl font-bold text-green-950 mb-2">
                    {activeMapInfo?.label || "Select a State"}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {activeMapInfo?.isUnionTerritory
                      ? "This is a Union Territory. Detailed tourist guides are available for the 28 states of India."
                      : "Click or tap any state on the map to view its detailed attractions, capital, and travel information."}
                  </p>
                  <button
                    onClick={() => {
                      const rj = states.find((s) => s.id === 21);
                      if (rj) {
                        setSelectedId("rj");
                      }
                    }}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm inline-flex items-center gap-1.5"
                  >
                    <span>View Rajasthan as example</span>
                    <FaArrowRight className="text-xs" />
                  </button>
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
