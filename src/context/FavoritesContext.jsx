import { createContext, useContext, useState, useEffect } from "react";
import states from "../data/state";

const STORAGE_KEY = "india_explorer_favorites";

const FavoritesContext = createContext(null);

function loadStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === "string" && id.trim() !== "");
    }
  } catch {
    // Ignore storage read errors
  }
  return [];
}

// Lookup map from destination id/slug to canonical { place, region } from state.js
const DESTINATION_MAP = new Map();
for (const region of states) {
  for (const place of region.touristPlaces || []) {
    const key = place.slug || place.id;
    if (key) {
      DESTINATION_MAP.set(key, { place, region });
    }
    if (place.id && place.id !== key) {
      DESTINATION_MAP.set(place.id, { place, region });
    }
  }
}

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(loadStoredFavorites);

  // Persist to localStorage whenever favoriteIds changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage write errors
    }
  }, [favoriteIds]);

  // Synchronize across browser tabs/windows if localStorage changes externally
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        setFavoriteIds(loadStoredFavorites());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isFavorite = (placeIdOrSlug) => {
    if (!placeIdOrSlug) return false;
    return favoriteIds.includes(placeIdOrSlug);
  };

  const toggleFavorite = (placeIdOrSlug) => {
    if (!placeIdOrSlug) return;
    setFavoriteIds((prev) =>
      prev.includes(placeIdOrSlug)
        ? prev.filter((id) => id !== placeIdOrSlug)
        : [...prev, placeIdOrSlug]
    );
  };

  const removeFavorite = (placeIdOrSlug) => {
    if (!placeIdOrSlug) return;
    setFavoriteIds((prev) => prev.filter((id) => id !== placeIdOrSlug));
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  // Resolve full destination & region objects from existing dataset without duplicating records
  const favoriteDestinations = favoriteIds
    .map((id) => DESTINATION_MAP.get(id))
    .filter(Boolean);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteDestinations,
        favoritesCount: favoriteDestinations.length,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
