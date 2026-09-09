import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  
const navigate = useNavigate();
  return (
    <section className="relative lg:min-h-[91vh] min-h-[100vh] flex items-center justify-center overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/tourism1.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-6xl font-bold text-white mb-6"
        >
          Explore Incredible India
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl md:text-2xl text-white mb-10"
        >
          Discover beautiful places, cultures and unforgettable experiences
        </motion.p>

        <motion.button 
  initial={{ opacity: 0, y: 50 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.5, delay: 0.6 }}
  onClick={() => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("states")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }}
  className="bg-orange-500 hover:bg-orange-600 text-white text-lg md:text-xl lg:px-6 lg:py-3 px-12 py-4 rounded-2xl font-medium transition duration-300"
>
  Explore Now..
</motion.button>

      </div>
    </section>
  );
};

export default Hero;