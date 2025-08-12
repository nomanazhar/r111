import ServicePageClient from './pageClient';
import { supabase } from '@/lib/supabaseClient';
import type { Service } from '@/lib/types';

export default async function ServicePage({ params }: { params: { id: string } }) {
  const { data } = await supabase.from('services').select('*').eq('id', params.id).limit(1);
  const service = (data as Service[] | null)?.[0];
  return <ServicePageClient service={service} />;
}


