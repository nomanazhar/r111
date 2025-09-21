'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import type { Service, Category } from '@/lib/types';
// import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className = '' }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Check if navbar has blue background
  const isBlueNavbar = className.includes('text-grey-800');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch services and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' })
        ]);

        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Group services by category
  const getServicesByCategory = () => {
    const grouped: { [key: string]: Service[] } = {};
    services.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });
    return grouped;
  };

  const servicesByCategory = getServicesByCategory();

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[10vh] z-50 transition-all duration-100 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-md !text-blue-700' 
        : 'backdrop-blur-sm'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full w-[100%]">
        <div className="flex justify-between items-center h-full w-[90%]">
          {/* Logo */}
          <div className="flex-shrink-0 z-10 w-[30%] ht-groteks">
            <Link href="/" className={`text-3xl ht-groteks font-bold transition-colors ${
              isBlueNavbar 
                ? 'text-grey-800 hover:text-blue-200' 
                : isScrolled 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-blue-600 hover:text-blue-700'
            }`}>
              {/* <img src="/12345.png" alt="RIII" className="mt-[7.5%] lg:w-[30%]  w-[100px] h-[45%]" /> */}
              R111
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block w-[46%]">
            <div className="ml-10 flex items-baseline space-x-10">
              <Link 
                href="/#categories" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-blue-600'
                }`}
              >
                Categories
              </Link>
              
              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesHovered(true)}
                onMouseLeave={() => setIsServicesHovered(false)}
              >
                <button 
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white/90 hover:text-blue-600'
                  }`}
                >
                  Services
                  <HiChevronDown className={`w-4 h-4 transition-transform ${isServicesHovered ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isServicesHovered && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-2">
                        {Object.entries(servicesByCategory).map(([categorySlug, services]) => {
                          const category = categories.find(cat => cat.slug === categorySlug);
                          return (
                            <div key={categorySlug} className="mb-2 last:mb-0">
                              <h3 className="text-sm font-semibold text-gray-800  flex items-center gap-2">
                                <span className="text-lg">{category?.icon}</span>
                                {category?.name}
                              </h3>
                              <div className="space-y-1">
                                {services.map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.id}`}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link 
                href="/#locations" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-blue-600'
                }`}
              >
                Locations
              </Link>
              <Link
                href="/about" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-blue-600'
                }`}
              >
                About
              </Link>
              <Link
                href="/blog" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-blue-600'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/contact" 
                className={`px-2 py-2 text-sm font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-blue-600'
                }`}
              >
                Contact
              </Link>
              {/* <Link 
                href="/adminkknnhhiiffttllooffppadmin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Admin
              </Link> */}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0 z-10">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors bg-white text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/#categories"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    Services
                  </div>
                  {Object.entries(servicesByCategory).map(([categorySlug, services]) => {
                    const category = categories.find(cat => cat.slug === categorySlug);
                    return (
                      <div key={categorySlug} className="ml-4 space-y-1">
                        <div className="px-3 py-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                          <span className="text-base">{category?.icon}</span>
                          {category?.name}
                        </div>
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            className="block px-6 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/#locations"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Locations
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/blog"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
                {/* <Link
                  href="/admin"
                  className="block px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors mx-3 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;