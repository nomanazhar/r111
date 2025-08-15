import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabase.from('reviews').select('*').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received review data:', body);

    // Extract and validate fields
    const name = String(body?.name || '').trim();
    const service = String(body?.service || '').trim();
    const rating = Number(body?.rating);
    const comment = String(body?.comment || '').trim();
    const avatar = typeof body?.avatar === 'string' ? body.avatar.trim() : null; // Handle optional/nullable avatar
    const date = new Date().toISOString().split('T')[0]; // Generate current date in YYYY-MM-DD format

    // Ensure ID is generated if not provided by frontend (though frontend should generate it now)
    const id = String(body?.id || crypto.randomUUID()).trim();

    // Validate required fields (excluding avatar)
    if (!id || !name || !service || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment || !date) {
      console.error('Missing or invalid review fields:', { id, name, service, rating, comment, date });
      return NextResponse.json({ error: 'Missing or invalid required review fields (name, service, rating, comment)' }, { status: 400 });
    }

    const insertPayload = { id, name, service, rating, comment, date, avatar: avatar || null }; // Ensure avatar is null if empty string

    const { data, error } = await supabase.from('reviews').insert(insertPayload).select('*').single();

    if (error) {
      console.error('Supabase insert review error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Review created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/reviews unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}


