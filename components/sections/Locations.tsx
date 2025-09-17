'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiLocationMarker } from 'react-icons/hi';
import { useState } from 'react';
import type { Location } from '@/lib/types';
import Link from 'next/link';

const Locations = ({ locations }: { locations: Location[] }) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Function to get the correct image path
  const getImagePath = (imageUrl: string) => {
    // If it's already a local path (starts with /), return as is
    if (imageUrl.startsWith('/')) {
      console.log('Using local path:', imageUrl);
      return imageUrl;
    }
    
    // If it's an external URL, return as is
    if (imageUrl.startsWith('http')) {
      console.log('Using external URL:', imageUrl);
      return imageUrl;
    }
    
    // If it's just a filename, add the / prefix
    const localPath = `/${imageUrl}`;
    console.log('Converting filename to local path:', localPath);
    return localPath;
  };

  // Handle image load errors
  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl));
  };

  // Get fallback image based on city name
  const getFallbackImage = (city: string) => {
    const cityLower = city.toLowerCase();
    if (cityLower.includes('dubai')) return '/dubai-pictures-bf8wpz0jvz5dr2qv.jpg';
    if (cityLower.includes('abu')) return '/abu dhabi.jpg';
    if (cityLower.includes('sharjah')) return '/sharjah.jpg';
    if (cityLower.includes('ajman')) return '/ajman.webp';
    return '/dubai-pictures-bf8wpz0jvz5dr2qv.jpg'; // Default fallback
  };

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
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              We're <span className="text-[#245FE8]">Everywhere</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quality home services available in major cities across the country
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
             <Link href="/#services">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={imageErrors.has(location.image) ? getFallbackImage(location.city) : getImagePath(location.image)}
                      alt={`${location.name}, ${location.city}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 4} // Prioritize first 4 images
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      onError={() => handleImageError(location.image)}
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
                  {/* <div className="p-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600">
                      Book Services Here
                    </button>
                  </div> */}
                </div>
                </Link>
              </motion.div>
            ))}
          </div>

          
        </motion.div>
      </div>
    </section>
  );
};

export default Locations;