
import React, { useEffect } from "react";
import states from "../data/state";
import Statecard from "./Statecard";

const StatesSection = ({ searchText }) => {

  const filteredStates = states.filter((state) => {
    return state.state.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    if (searchText.trim() !== "") {

      const foundState = states.find((state) =>
        state.state.toLowerCase().includes(searchText.toLowerCase())
      );

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
  }, [searchText]);

  return (
    <section id="states" className="bg-emerald-50 py-16 px-3">

      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-5xl md:text-5xl font-bold text-green-950">
          Explore Indian States
        </h2>

        <p className="text-slate-600 mt-3 text-2xl">
          Discover the beauty, culture and incredible places of India
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center items-center">
        {filteredStates.map((state) => (
          <Statecard
            key={state.id}
            state={state}
          />
        ))}
      </div>

    </section>
  );
};

export default StatesSection;
