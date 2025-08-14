import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('GET /api/orders error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log('Orders fetched:', data?.length || 0, 'orders');
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('GET /api/orders unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received order data:', body);

    // Validate required fields
    const requiredFields = ['userid', 'serviceid', 'status', 'customerName', 'phone', 'address', 'date', 'time', 'total']; // Changed from userId, serviceId
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(body)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Order created successfully:', data);
    return NextResponse.json(data, { status: 201 });
    
  } catch (e: any) {
    console.error('POST /api/orders unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}


