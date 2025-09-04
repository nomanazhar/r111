import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import DiscountBanner from '@/components/sections/DiscountBanner';
import Categories from '@/components/sections/Categories';
import Services from '@/components/sections/Services';
import WhyRIII from '@/components/sections/WhyRIII';
import Reviews from '@/components/sections/Reviews';
import Locations from '@/components/sections/Locations';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import type { Category, Service, Location, Review } from '@/lib/types';

export const revalidate = 0;

export default async function Home() {
  let categories: Category[] = [];
  let services: Service[] = [];
  let locations: Location[] = [];
  let reviews: Review[] = [];

  if (supabase) {
    const [{ data: categoriesData }, { data: servicesData }, { data: locationsData }, { data: reviewsData }] = await Promise.all([
      supabase.from('categories').select('*').order('id'),
      supabase.from('services').select('*').order('id'),
      supabase.from('locations').select('*').order('id'),
      supabase.from('reviews').select('*').order('id'),
    ]);

    categories = (categoriesData as Category[]) || [];
    services = (servicesData as Service[]) || [];
    locations = (locationsData as Location[]) || [];
    reviews = (reviewsData as Review[]) || [];
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <DiscountBanner services={services} />
      <Categories categories={categories} />
      <Services services={services} categories={categories} />
      <WhyRIII />
      <Reviews reviews={reviews} />
      <Locations locations={locations} />
      <Contact />
      <Footer />
    </main>
  );
}