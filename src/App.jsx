import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import IndiaMap from "./components/IndiaMap";
import Statesection from "./components/Statesection";
import TouristPlaces from "./components/TouristPlaces";
import TouristPlaceDetail from "./components/TouristPlaceDetail";
import Favorites from "./components/Favorites";
import Footer from "./components/Footer";

const App = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#031510] text-white selection:bg-orange-500 selection:text-white">
          <Navbar
            searchText={searchText}
            setSearchText={setSearchText}
          />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <IndiaMap />
                  <Statesection
                    searchText={searchText}
                    setSearchText={setSearchText}
                  />
                </>
              }
            />

            <Route
              path="/tourist-places"
              element={<TouristPlaces />}
            />

            <Route
              path="/tourist-places/:slug"
              element={<TouristPlaceDetail />}
            />

            <Route
              path="/place/:slug"
              element={<TouristPlaceDetail />}
            />

            <Route
              path="/favorites"
              element={<Favorites />}
            />

            <Route
              path="/favourites"
              element={<Favorites />}
            />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
};

export default App;