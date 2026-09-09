import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Statecard = ({ state }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
    
  id={`state-${state.id}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: false, amount: 0.3 }}
      className="group max-w-6xl lg:w-96  bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 m-4"
    >

      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={state.image}
          alt={state.state}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">

        {/* State Name */}
        <h2 className="text-green-950 lg:text-2xl text-3xl font-bold">
          {state.state}
        </h2>

        {/* Capital */}
        <div className="flex items-center gap-2 mt-2 text-slate-600">
          <FaLocationDot className="text-orange-500" />

          <span className="lg:text-[16px] text-[25px] font-medium">
            {state.capital}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-slate-500 lg:text-[15px] text-[18px] leading-relaxed">
          {state.description}
        </p>

        {/* Button */}
        <button
          onClick={() => {
  navigate("/tourist-places", { state });
  window.scrollTo(0, 0);
}}
          className="mt-5 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-7 py-4 rounded-xl font-medium transition-all duration-300 hover:gap-3"
        >
          <span>Explore Now</span>
          <FaArrowRight />
        </button>

      </div>
    </motion.div>
  );
};

export default Statecard;