import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLocationDot, FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const TouristPlaces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">
          State data not found
        </h1>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* Hero Section */}
      <div className="relative h-[320px] overflow-hidden">

        <img
          src={state.image}
          alt={state.state}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-green-950/70"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 text-white"
        >
          <p className="text-orange-400 font-semibold text-lg mb-2">
            Discover India
          </p>

          <h1 className="text-4xl md:text-6xl font-bold">
            Explore {state.state}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-200 text-sm md:text-base">
            {state.description}
          </p>
        </motion.div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-green-800 font-semibold hover:text-orange-500 transition"
        >
          <FaArrowLeft />
          Back to States
        </motion.button>
      </div>

      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-10 px-5"
      >
        <p className="text-orange-500 font-semibold">
          TOP DESTINATIONS
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-green-950 mt-2">
          Places to Visit in {state.state}
        </h2>

        <p className="text-gray-500 mt-3">
          Explore the best tourist destinations of {state.state}
        </p>
      </motion.div>

      {/* Tourist Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {state.touristPlaces.map((place) => (
          <motion.div
            key={place.name}
            variants={cardVariants}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
          >

            {/* Image */}
            <div className="relative h-56 overflow-hidden">

              <motion.img
                src={place.image}
                alt={place.name}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Place Name on Image */}
              <h3 className="absolute bottom-4 left-5 text-white text-2xl font-bold">
                {place.name}
              </h3>
            </div>

            {/* Card Content */}
            <div className="p-6">

              {/* Location */}
              <div className="flex items-center gap-2 text-orange-500 font-medium">
                <FaLocationDot />
                <span>{place.city}</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-4 leading-relaxed line-clamp-3">
                {place.description}
              </p>

              {/* Explore Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Explore
                <FaArrowRight className="text-sm" />
              </motion.button>

            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TouristPlaces;