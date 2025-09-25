'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGoogle, FaWhatsapp, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const footerSections = [
    {
      title: 'Resources',
      links: [
        { name: 'FAQs', href: '/faqs' },
        { name: 'The Home Project Blog', href: '/blog' },
        { name: 'Write a review', href: '/reviews' },
        { name: 'Our service guarantee', href: '/guarantee' }
      ]
    },
    {
      title: 'About us',
      links: [
        { name: 'About us', href: '/about' },
        { name: 'Terms and Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Contact us', href: '/contact' }
      ]
    },
    {
      title: 'Partners',
      links: [
        { name: 'Become a partner', href: '/become-partner' }
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61580245816985', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/r111movers/', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://x.com/R111Team11683?t=xip3kr1LQRBHyFEeHj7Leg&s=08', label: 'Twitter' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@r111.movers?_t=ZS-8zvA9T5ESsC&_r=1', label: 'TikTok' },
    { icon: FaGoogle, href: 'https://www.google.com/search?q=r111movers.com', label: 'Google' },
    { icon: FaWhatsapp, href: 'https://wa.me/971525288716', label: 'WhatsApp' }
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
    <footer className="bg-[#054351] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        {/* Main Footer Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12 w-[70%] flex items-center justify-center"
        >
          {/* Resources Column */}
          {/* <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerSections[0].links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div> */}

          {/* About us Column */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">About us</h3>
            <ul className="space-y-3">
              {footerSections[1].links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Partners Column */}
          {/* <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Partners</h3>
            <ul className="space-y-3">
              {footerSections[2].links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div> */}

          {/* Get in touch Column */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Get in touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <HiLocationMarker className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 text-sm leading-relaxed">
                  31 floor Api Tower sheikh Zayed road, Dubai, UAE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiPhone className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">+971 52 528 8716</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiMail className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">r111movers@gmail.com</span>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Section with Social Media and Legal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="border-t border-teal-700 pt-8"
        >
          {/* Social Media Icons */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-teal-800 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-teal-800 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Legal Text */}
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/terms" className="text-white/90 hover:text-white transition-colors">
                Terms and Conditions
              </Link>
              <span className="text-white/60">|</span>
              <Link href="/privacy" className="text-white/90 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
            <p className="text-white/80 text-sm">
              RIII is licensed by Dubai Health Authority (DHA) 
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;