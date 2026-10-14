import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCompass, FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/tourism1.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Multi-layer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#031510]/65 via-[#031510]/45 to-[#031510]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,21,16,0.75)_100%)]"></div>

      {/* Ambient Glowing Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Content Directly Over Video */}
      <div className="relative z-10 max-w-5xl w-full mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-orange-300 mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          >
            <FaCompass className="text-orange-400 text-base animate-spin" style={{ animationDuration: "12s" }} />
            <span>Discover the Soul of Bharat</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
          >
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300">
              Incredible India
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="text-base sm:text-xl md:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-10 font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
          >
            Journey through snow-capped Himalayas, royal desert citadels, serene backwaters, and timeless cultural heritage across 28 vibrant states and 8 Union Territories.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document.getElementById("states")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-base sm:text-lg px-8 py-4 rounded-2xl font-semibold shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_14px_38px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <span>Explore Now</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </button>


            <button
              type="button"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document.getElementById("explore-map")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-black/35 hover:bg-black/50 text-white text-base sm:text-lg px-7 py-4 rounded-2xl font-semibold border border-white/35 hover:border-white/60 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <FaMapMarkedAlt className="text-orange-300 text-lg" />
              <span>Interactive Map</span>
            </button>
          </motion.div>

          {/* Quick Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 pt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          >
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white font-serif-display">28 + 8</p>
              <p className="text-xs sm:text-sm text-white/85 mt-0.5">States &amp; UTs</p>
            </div>
            <div className="text-center border-x border-white/25 px-2">
              <p className="text-2xl sm:text-3xl font-bold text-orange-300 font-serif-display">216</p>
              <p className="text-xs sm:text-sm text-white/85 mt-0.5">Iconic Landmarks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-300 font-serif-display">5000+</p>
              <p className="text-xs sm:text-sm text-white/85 mt-0.5">Years of Culture</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;