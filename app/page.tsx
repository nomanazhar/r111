import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Categories from '@/components/sections/Categories';
import Services from '@/components/sections/Services';
import WhyRIII from '@/components/sections/WhyRIII';
import Reviews from '@/components/sections/Reviews';
import Locations from '@/components/sections/Locations';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import type { Category, Service, Location, Review } from '@/lib/types';

export default async function Home() {
  const [{ data: categories }, { data: services }, { data: locations }, { data: reviews }] = await Promise.all([
    supabase.from('categories').select('*').order('id'),
    supabase.from('services').select('*').order('id'),
    supabase.from('locations').select('*').order('id'),
    supabase.from('reviews').select('*').order('id'),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories categories={(categories as Category[]) || []} />
      <Services services={(services as Service[]) || []} categories={(categories as Category[]) || []} />
      <WhyRIII />
      <Reviews reviews={(reviews as Review[]) || []} />
      <Locations locations={(locations as Location[]) || []} />
      <Footer />
    </main>
  );
}