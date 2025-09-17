import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const published = searchParams.get('published');
  const slug = searchParams.get('slug');

  let query = supabaseAdmin.from('blogs').select('*').order('created_at', { ascending: false });
  
  if (published !== null) {
    query = query.eq('published', published === 'true');
  }
  
  if (slug) {
    query = query.eq('slug', slug);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();

    const title = String(body?.title || '').trim();
    const content = String(body?.content || '').trim();
    const image = String(body?.image || '').trim();
    const author = String(body?.author || 'RIII Team').trim();
    const published = Boolean(body?.published);

    if (!title || !content || !image) {
      return NextResponse.json({ error: 'Missing required fields: title, content, image' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const id = typeof body?.id === 'string' && body.id.length > 0 ? body.id : (globalThis.crypto?.randomUUID?.() || undefined);
    const insertPayload = { 
      id, 
      title, 
      slug, 
      content, 
      image, 
      author, 
      published
    };

    const { data, error } = await supabaseAdmin.from('blogs').insert(insertPayload).select('*').single();
    if (error) {
      console.error('POST /api/blogs insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/blogs unexpected error:', e?.message || e);
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
  
  // If title is being updated, regenerate slug
  if (updates.title) {
    updates.slug = updates.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  
  const { data, error } = await supabaseAdmin
    .from('blogs')
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
  const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
