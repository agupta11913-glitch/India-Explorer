import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCompass,
  FaLocationDot,
  FaArrowRight,
  FaMountainSun,
  FaUmbrellaBeach,
  FaLandmarkDome,
  FaPlaceOfWorship,
  FaPaw,
  FaLayerGroup,
  FaMapLocationDot,
  FaFlag,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import { IoSearch, IoClose } from "react-icons/io5";
import states from "../data/state";
import Statecard from "./Statecard";
import { useFavorites } from "../context/FavoritesContext";
import { DESTINATION_FALLBACK_IMAGE } from "../data/verifiedImages";

const CATEGORY_LABEL_MAP = {
  Mountains: "Mountains",
  Beaches: "Beaches",
  Historical: "Historical Places",
  Religious: "Religious Places",
  Wildlife: "Wildlife & Nature",
};

const CATEGORY_KEYS = ["Mountains", "Beaches", "Historical", "Religious", "Wildlife"];

function placeHasCategory(place, categoryId) {
  if (Array.isArray(place.categories)) {
    return place.categories.includes(categoryId);
  }
  return place.filterCategory === categoryId;
}

function placeMatchesQuery(place, region, query) {
  if (!query) return true;
  const matchesPlaceName = place.name.toLowerCase().includes(query);
  const matchesCity = place.city.toLowerCase().includes(query);
  const matchesLocation =
    place.location && place.location.toLowerCase().includes(query);
  const matchesParentState = region.state.toLowerCase().includes(query);
  const matchesCapital = region.capital.toLowerCase().includes(query);
  const matchesCatLabel =
    place.category && place.category.toLowerCase().includes(query);
  const matchesCategories = Array.isArray(place.categories)
    ? place.categories.some(
        (c) =>
          c.toLowerCase().includes(query) ||
          (CATEGORY_LABEL_MAP[c] &&
            CATEGORY_LABEL_MAP[c].toLowerCase().includes(query))
      )
    : false;

  return Boolean(
    matchesPlaceName ||
      matchesCity ||
      matchesLocation ||
      matchesParentState ||
      matchesCapital ||
      matchesCatLabel ||
      matchesCategories
  );
}

const StatesSection = ({ searchText = "", setSearchText }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  // Unified activeFilter: "all" | "States" | "Union Territories" | "Mountains" | "Beaches" | "Historical" | "Religious" | "Wildlife"
  const [activeFilter, setActiveFilter] = useState("all");

  const totalStates = states.filter((s) => s.type !== "union-territory").length;
  const totalUTs = states.filter((s) => s.type === "union-territory").length;

  const getCategoryCount = (catId) => {
    let count = 0;
    for (const reg of states) {
      for (const p of reg.touristPlaces || []) {
        if (placeHasCategory(p, catId)) count++;
      }
    }
    return count;
  };

  const FILTER_CHIPS = [
    {
      id: "all",
      label: "All Destinations",
      count: states.length,
      icon: FaLayerGroup,
    },
    {
      id: "States",
      label: "States",
      count: totalStates,
      icon: FaMapLocationDot,
    },
    {
      id: "Union Territories",
      label: "Union Territories",
      count: totalUTs,
      icon: FaFlag,
    },
    {
      id: "Mountains",
      label: "Mountains",
      count: getCategoryCount("Mountains"),
      icon: FaMountainSun,
    },
    {
      id: "Beaches",
      label: "Beaches",
      count: getCategoryCount("Beaches"),
      icon: FaUmbrellaBeach,
    },
    {
      id: "Historical",
      label: "Historical Places",
      count: getCategoryCount("Historical"),
      icon: FaLandmarkDome,
    },
    {
      id: "Religious",
      label: "Religious Places",
      count: getCategoryCount("Religious"),
      icon: FaPlaceOfWorship,
    },
    {
      id: "Wildlife",
      label: "Wildlife & Nature",
      count: getCategoryCount("Wildlife"),
      icon: FaPaw,
    },
  ];

  const query = searchText.trim().toLowerCase();
  const isCategoryFilter = CATEGORY_KEYS.includes(activeFilter);

  // 1. Filter States & Union Territories (Only applicable when not filtering by a specific place category)
  const matchingRegions = isCategoryFilter
    ? []
    : states.filter((region) => {
        if (activeFilter === "States" && region.type === "union-territory") {
          return false;
        }
        if (
          activeFilter === "Union Territories" &&
          region.type !== "union-territory"
        ) {
          return false;
        }

        if (!query) return true;

        const matchesStateName = region.state.toLowerCase().includes(query);
        const matchesCapital = region.capital.toLowerCase().includes(query);
        return matchesStateName || matchesCapital;
      });

  // 2. Filter Individual Tourist Places
  const matchingPlaces = [];
  for (const region of states) {
    if (activeFilter === "States" && region.type === "union-territory") {
      continue;
    }
    if (
      activeFilter === "Union Territories" &&
      region.type !== "union-territory"
    ) {
      continue;
    }

    for (const place of region.touristPlaces || []) {
      if (isCategoryFilter && !placeHasCategory(place, activeFilter)) {
        continue;
      }

      if (!placeMatchesQuery(place, region, query)) {
        continue;
      }

      matchingPlaces.push({ place, region });
    }
  }

  useEffect(() => {
    if (query !== "" && !isCategoryFilter) {
      const foundState = states.find((item) => {
        if (activeFilter === "States" && item.type === "union-territory") {
          return false;
        }
        if (
          activeFilter === "Union Territories" &&
          item.type !== "union-territory"
        ) {
          return false;
        }
        return item.state.toLowerCase().includes(query);
      });

      if (foundState) {
        setTimeout(() => {
          document
            .getElementById(`state-${foundState.id}`)
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }, 100);
      }
    }
  }, [query, activeFilter, isCategoryFilter]);

  const handleResetAll = () => {
    if (setSearchText) setSearchText("");
    setActiveFilter("all");
  };

  const showPlacesGrid = isCategoryFilter || query !== "";
  const showRegionsGrid = !isCategoryFilter && matchingRegions.length > 0;
  const hasAnyResults =
    (showPlacesGrid && matchingPlaces.length > 0) ||
    (showRegionsGrid && matchingRegions.length > 0);

  const activeFilterObj =
    FILTER_CHIPS.find((f) => f.id === activeFilter) || FILTER_CHIPS[0];

  return (
    <section
      id="states"
      className="relative py-20 px-4 bg-gradient-to-b from-[#031510] via-[#05231b] to-[#031510] overflow-hidden"
    >
      {/* Ambient Background Glows */}
      <div className="absolute top-20 right-1/4 w-[480px] h-[480px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[480px] h-[480px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-orange-300 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-4">
            <FaCompass className="text-orange-400 text-base" />
            <span>Global Destination Explorer • 36 Regions • 216 Places</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Explore Indian{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300">
              States &amp; Destinations
            </span>
          </h2>

          <p className="text-emerald-100/75 mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Search across all {totalStates} States, {totalUTs} Union Territories, and 216 famous tourist landmarks, or filter by destination category.
          </p>

          {/* Prominent Frosted-Glass Global Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <IoSearch className="absolute left-5 text-orange-400 text-xl pointer-events-none" />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText && setSearchText(e.target.value)}
                aria-label="Search destinations, states, Union Territories, or cities"
                placeholder="Search states, Union Territories, tourist places, or cities (e.g., Rajasthan, Taj Mahal, Leh)..."
                className="glass-input w-full h-14 pl-13 pr-28 rounded-2xl text-sm sm:text-base text-white placeholder:text-emerald-100/50 outline-none transition-all duration-300 shadow-xl"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText && setSearchText("")}
                  aria-label="Clear search query"
                  className="absolute right-3 inline-flex items-center gap-1.5 glass-pill hover:bg-white/20 text-orange-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <IoClose className="text-sm" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Unified Destination & Category Filter Chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto">
            {FILTER_CHIPS.map((chip) => {
              const IconComponent = chip.icon;
              const isSelected = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveFilter(chip.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 border border-orange-300/60 scale-105"
                      : "glass-pill text-emerald-100/85 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <IconComponent
                    className={isSelected ? "text-white" : "text-orange-400"}
                  />
                  <span>{chip.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-black/25 text-white"
                        : "bg-white/10 text-emerald-200/80"
                    }`}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Search / Filter Status Bar */}
          {(query !== "" || activeFilter !== "all") && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs sm:text-sm text-emerald-100">
                <span>
                  {isCategoryFilter ? (
                    <>
                      Showing{" "}
                      <strong className="text-orange-300">
                        {matchingPlaces.length}
                      </strong>{" "}
                      {matchingPlaces.length === 1
                        ? "destination"
                        : "destinations"}{" "}
                      in{" "}
                      <strong className="text-orange-300">
                        {activeFilterObj.label}
                      </strong>
                    </>
                  ) : query !== "" ? (
                    <>
                      Found{" "}
                      <strong className="text-orange-300">
                        {matchingRegions.length}
                      </strong>{" "}
                      {matchingRegions.length === 1 ? "region" : "regions"} &amp;{" "}
                      <strong className="text-orange-300">
                        {matchingPlaces.length}
                      </strong>{" "}
                      {matchingPlaces.length === 1
                        ? "tourist place"
                        : "tourist places"}
                      {activeFilter !== "all"
                        ? ` in ${activeFilterObj.label}`
                        : ""}
                    </>
                  ) : (
                    <>
                      Showing{" "}
                      <strong className="text-orange-300">
                        {matchingRegions.length}
                      </strong>{" "}
                      {activeFilterObj.label} ({matchingPlaces.length} tourist
                      destinations)
                    </>
                  )}
                  {query ? ` matching "${searchText}"` : ""}
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 glass-pill hover:bg-white/20 text-orange-300 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
              >
                <IoClose />
                <span>Reset to All Destinations</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Display */}
        {hasAnyResults ? (
          <div className="space-y-16">
            {/* Matching Tourist Places Grid (Shown when a Category filter is active OR when searching) */}
            {showPlacesGrid && matchingPlaces.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6 px-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                      {isCategoryFilter
                        ? `${activeFilterObj.label} Category`
                        : "Matching Tourist Places"}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mt-0.5">
                      {isCategoryFilter
                        ? `${activeFilterObj.label} (${matchingPlaces.length})`
                        : `Tourist Destinations Matching "${searchText}" (${matchingPlaces.length})`}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {matchingPlaces.map(({ place, region }) => {
                    const placeKey = place.slug || place.id;
                    const favorited = isFavorite(placeKey);
                    const badgeLabel = isCategoryFilter
                      ? CATEGORY_LABEL_MAP[activeFilter] || place.category
                      : place.category;
                    return (
                      <motion.div
                        key={placeKey}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        whileHover={{ y: -8 }}
                        onClick={() => {
                          navigate(`/tourist-places/${place.slug}`, {
                            state: { place, region },
                          });
                          window.scrollTo(0, 0);
                        }}
                        className="group glass-card rounded-[1.85rem] overflow-hidden flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          {/* Place Image */}
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
                            <div className="absolute inset-0 bg-gradient-to-t from-[#031510] via-[#031510]/25 to-transparent" />

                            {/* Region & City Badge */}
                            <div className="absolute top-3.5 left-3.5 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-white shadow-md max-w-[75%]">
                              <FaLocationDot className="text-orange-400 shrink-0" />
                              <span className="truncate">
                                {place.city}, {region.state}
                              </span>
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

                            {/* Category Badge */}
                            {badgeLabel && (
                              <div className="absolute bottom-12 left-5 glass-pill px-3 py-0.5 rounded-full text-[10px] font-semibold text-orange-300">
                                {badgeLabel}
                              </div>
                            )}

                            {/* Place Title */}
                            <div className="absolute bottom-3.5 left-5 right-5">
                              <h4 className="text-white text-2xl font-bold tracking-tight group-hover:text-orange-300 transition-colors drop-shadow-md truncate">
                                {place.name}
                              </h4>
                            </div>
                          </div>

                          {/* Place Description */}
                          <div className="p-6 pt-4">
                            <p className="text-emerald-50/80 text-sm leading-relaxed line-clamp-3">
                              {place.description}
                            </p>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="px-6 pb-6 pt-1">
                          <div className="w-full flex items-center justify-between glass-pill group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 text-white py-3 px-5 rounded-2xl font-semibold text-sm transition-all duration-300">
                            <span>Explore {place.name}</span>
                            <span className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center">
                              <FaArrowRight className="text-xs text-orange-300 group-hover:text-white" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matching States & Union Territories Grid (Shown only when All, States, or Union Territories filter is active) */}
            {showRegionsGrid && (
              <div>
                {query !== "" && (
                  <div className="mb-6 px-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                      Matching Regions
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mt-0.5">
                      States &amp; Union Territories ({matchingRegions.length})
                    </h3>
                  </div>
                )}

                <div className="flex flex-wrap justify-center items-stretch gap-7">
                  {matchingRegions.map((state) => (
                    <Statecard key={state.id} state={state} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Friendly "No destinations found" Empty State */
          <div className="max-w-lg mx-auto glass-panel rounded-3xl p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-pill flex items-center justify-center text-orange-400 text-2xl">
              <IoSearch />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No destinations found
            </h3>
            <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">
              We couldn&apos;t find any States, Union Territories, or tourist places matching{" "}
              {query ? (
                <>
                  <strong className="text-orange-300">&ldquo;{searchText}&rdquo;</strong>
                </>
              ) : (
                "your selected filters"
              )}
              . Try a different keyword or reset the active filters.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg transition cursor-pointer"
            >
              <IoClose className="text-base" />
              <span>Clear Search &amp; Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatesSection;
