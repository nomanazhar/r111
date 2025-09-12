'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';


const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Navigate to services or results page
  //   const servicesSection = document.getElementById('services');
  //   servicesSection?.scrollIntoView({ behavior: 'smooth' });
  // };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            variants={fadeInUp}
          >
            <span className="text-blue-400">#1</span>
            <Image 
              src="/flag-of-the-united-arab-emirates.webp" 
              alt="UAE Flag" 
              width={60} 
              height={40} 
              className="inline-block mx-2 align-middle"
            />
            Super App for all{' '}
            <span className="text-[#2CB5E8]">
              Home Services
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Book trusted professionals for cleaning, repairs, beauty services and more
          </motion.p>

          <motion.div 
            className="max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {/* <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex-1 flex items-center px-4 py-3">
                  <HiLocationMarker className="text-gray-400 mr-3 h-5 w-5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-semibold text-lg shadow-lg"
                >
                  <HiSearch className="h-5 w-5" />
                  <span className="hidden sm:inline">Search Services</span>
                  <span className="sm:hidden">Search</span>
                </button>
              </div>
            </form> */}

            <motion.div 
              className="mt-8 flex flex-wrap gap-3 justify-center"
              variants={fadeInUp}
            >
              {['Moving & Shifting', 'Packing','Home-Cleaning',  'Electrician','Plumber','Painter','Maintainence'].map((service) => (
                <button
                  key={service}
                  onClick={() => {
                    setSearchQuery(service);
                    const servicesSection = document.getElementById('services');
                    servicesSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  {service}
                </button>
              ))}
              
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 backdrop-blur-sm border border-blue-600"
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;