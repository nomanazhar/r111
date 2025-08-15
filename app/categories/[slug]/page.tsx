import CategoryPageClient from './pageClient';
import { supabase } from '@/lib/supabaseClient';
import type { Category, Service, Location } from '@/lib/types';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  if (!supabase) {
    return <CategoryPageClient category={undefined} services={[]} locations={[]} />;
  }

  const [
    { data: categories },
    { data: services },
    { data: locations },
  ] = await Promise.all([
    supabase.from('categories').select('*').eq('slug', params.slug).limit(1),
    supabase.from('services').select('*').eq('category', params.slug),
    supabase.from('locations').select('*').order('id'),
  ]);

  const category = (categories as Category[] | null)?.[0];
  const categoryServices = (services as Service[] | null) || [];
  const allLocations = (locations as Location[] | null) || [];
  return <CategoryPageClient category={category} services={categoryServices} locations={allLocations} />;
}