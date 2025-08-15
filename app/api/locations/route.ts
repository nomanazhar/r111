import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }
  
  const { data, error } = await supabaseAdmin.from('locations').select('*').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();

    // Validate required fields
    const name = String(body?.name || '').trim();
    const city = String(body?.city || '').trim();
    const area = String(body?.area || '').trim();
    const image = String(body?.image || '').trim();
    const id = String(body?.id || '').trim(); // Get ID from body

    if (!name || !city || !area || !image || !id) {
      return NextResponse.json({ error: 'Missing required fields: id, name, city, area, and image are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('locations')
      .insert({ id, name, city, area, image }) // Include id in insert payload
      .select('*')
      .single();

    if (error) {
      console.error('POST /api/locations insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/locations unexpected error:', e?.message || e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('locations')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('locations').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}


