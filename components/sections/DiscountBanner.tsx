'use client';

import { useState, useEffect } from 'react';
import type { Service } from '@/lib/types';

interface DiscountBannerProps {
  services: Service[];
}

const DiscountBanner = ({ services }: DiscountBannerProps) => {
  const [discountTexts, setDiscountTexts] = useState<string[]>([]);

  useEffect(() => {
    // Filter services that have discounts > 0
    const servicesWithDiscounts = services.filter(service => service.discount && service.discount > 0);
    
    // Create discount text messages
    const texts = servicesWithDiscounts.map(service => 
      `${service.discount}% discount on ${service.name}`
    );

    // If no services with discounts, show a default message
    if (texts.length === 0) {
      setDiscountTexts(['Special offers available - Check our services!']);
    } else {
      setDiscountTexts(texts);
    }
  }, [services]);

  // Don't render if no discount texts
  if (discountTexts.length === 0) {
    return null;
  }

  return (
    <div 
      className="w-full bg-blue-600 text-black py-2 overflow-hidden relative"
      style={{ height: '8vh', zIndex: 999 }}
    >
      <div className="flex items-center h-full">
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Create multiple copies to ensure seamless scrolling */}
          {[...discountTexts, ...discountTexts, ...discountTexts, ...discountTexts].map((text, index) => (
            <div key={index} className="flex items-center mx-12 flex-shrink-0">
              <span className="text-lg font-semibold">
                🎉 {text} 🎉
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
