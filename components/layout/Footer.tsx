'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const footerSections = [
    {
      title: 'Services',
      links: [
        { name: 'Home Cleaning', href: '/categories/home-cleaning' },
        { name: 'PC Repair', href: '/categories/pc-repair' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Safety', href: '/safety' }
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: '#', color: 'hover:text-sky-400' },
    { icon: FaInstagram, href: '#', color: 'hover:text-pink-600' },
    { icon: FaLinkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="bg-gray-900 text-white w-[100vw]">
      <div className="w-[85%] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="w-[100%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 text-center md:text-left"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className='flex flex-row  w-[100%] '>
            <Link href="/">
            <img src="/logoR111.png" alt="RIII" className="w-[51%] h-[88%]" />
            </Link>
            <p className="text-gray-300 mb-2 leading-relaxed">
              <span className='text-italic font-bold text-[#245FE8]'> " </span> Your trusted partner for all home services. We connect you with verified professionals 
              to make your life easier and more comfortable <span className='text-italic font-bold text-[#245FE8]'> " </span>
            </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <HiPhone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+971 52 528 8716</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <HiMail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">r111movers@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <HiLocationMarker className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Available nationwide</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          {footerSections.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants} className='  text-left'>
              <h3 className="text-lg font-semibold mb-1">{section.title}</h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        {/* <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="border-t border-gray-800 mt-12 pt-12"
        >
          <motion.div variants={itemVariants} className="max-w-md mx-auto text-center lg:text-left lg:mx-0">
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates on new services and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-400 focus:outline-none transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.div> */}

        {/* Bottom Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <motion.p variants={itemVariants} className="text-gray-400 text-center md:text-left">
            © 2024 RIII. All rights reserved. Making homes better, one service at a time.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex items-center gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-300 text-xl`}
                >
                  <Icon />
                </a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;