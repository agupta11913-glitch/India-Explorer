import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Statesection from "./components/Statesection";
import TouristPlaces from "./components/TouristPlaces";

const App = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <BrowserRouter>
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
              <Statesection searchText={searchText} />
            </>
          }
        />

        <Route
          path="/tourist-places"
          element={<TouristPlaces />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;