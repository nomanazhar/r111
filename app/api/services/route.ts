import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();

    const name = String(body?.name || '').trim();
    const category = String(body?.category || '').trim();
    const price = Number(body?.price);
    const description = String(body?.description || '').trim();
    const image = String(body?.image || '').trim();
    const duration = String(body?.duration || '').trim();
    const rating = Number(body?.rating);

    if (!name || !category || !image || !duration || !description || !Number.isFinite(price) || !Number.isFinite(rating)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const id = typeof body?.id === 'string' && body.id.length > 0 ? body.id : (globalThis.crypto?.randomUUID?.() || undefined);
    const insertPayload = { id, name, category, price, description, image, duration, rating };

    const { data, error } = await supabaseAdmin.from('services').insert(insertPayload).select('*').single();
    if (error) {
      console.error('POST /api/services insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/services unexpected error:', e?.message || e);
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
    .from('services')
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
  const { error } = await supabaseAdmin.from('services').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}


