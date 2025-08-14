import ServicePageClient from './pageClient';
import { supabase } from '@/lib/supabaseClient';
import type { Service, Review } from '@/lib/types';

export default async function ServicePage({ params }: { params: { id: string } }) {
  const { data } = await supabase.from('services').select('*').eq('id', params.id).limit(1);
  const service = (data as Service[] | null)?.[0];
  let reviews: Review[] = [];
  if (service) {
    const { data: reviewRows } = await supabase.from('reviews').select('*').eq('service', service.name).order('id');
    reviews = (reviewRows as Review[] | null) ?? [];
  }
  const Client = ServicePageClient as unknown as (props: { service?: Service; reviews?: Review[] }) => JSX.Element;
  return <Client service={service} reviews={reviews} />;
}


