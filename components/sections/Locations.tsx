'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiLocationMarker } from 'react-icons/hi';
import type { Location } from '@/lib/types';

const Locations = ({ locations }: { locations: Location[] }) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="locations" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We're <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Everywhere</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quality home services available in major cities across the country
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={location.image}
                      alt={`${location.name}, ${location.city}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-1">{location.name}</h3>
                      <div className="flex items-center text-white/90">
                        <HiLocationMarker className="h-4 w-4 mr-1" />
                        <span className="text-sm">{location.area}, {location.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600">
                      Book Services Here
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            variants={itemVariants}
          >
            <p className="text-gray-600 mb-6">Don't see your city?</p>
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Request New Location
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Locations;