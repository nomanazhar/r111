import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('categories').insert(body).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // If slug is being updated, update all associated services
  if (updates.slug) {
    // First get the current category to check the old slug
    const { data: currentCategory } = await supabaseAdmin
      .from('categories')
      .select('slug')
      .eq('id', id)
      .single();

    if (currentCategory && currentCategory.slug !== updates.slug) {
      // Update all services that use the old slug to use the new slug
      const { error: servicesUpdateError } = await supabaseAdmin
        .from('services')
        .update({ category: updates.slug })
        .eq('category', currentCategory.slug);

      if (servicesUpdateError) {
        return NextResponse.json({ error: servicesUpdateError.message }, { status: 500 });
      }
    }
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
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

  // Get the category to check if it has associated services for user feedback
  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('slug')
    .eq('id', id)
    .single();

  let servicesCount = 0;
  if (category) {
    // Check if there are services using this category for user feedback
    const { data: services, error: servicesError } = await supabaseAdmin
      .from('services')
      .select('id')
      .eq('category', category.slug);

    if (servicesError) {
      return NextResponse.json({ error: servicesError.message }, { status: 500 });
    }

    servicesCount = services ? services.length : 0;
  }

  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Return success with information about cascaded deletions
  return NextResponse.json({ 
    success: true, 
    message: servicesCount > 0 ? `Category deleted. ${servicesCount} associated service(s) were also deleted due to cascade.` : 'Category deleted successfully.'
  });
}


