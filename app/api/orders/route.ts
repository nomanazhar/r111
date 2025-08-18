import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
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
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();
    console.log('Received order data:', body);

    // Validate required fields
    const requiredFields = ['userid', 'serviceid', 'status', 'customer_name', 'email', 'phone', 'address', 'date', 'time', 'total']; // Added email field
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
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
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    
    console.log('PATCH /api/orders - Received update:', { id, updates });
    console.log('Status being updated to:', updates.status);
    
    // Update the order
    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Failed to update order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Order updated successfully:', updatedOrder);

    // Initialize email status variables
    let emailSent = false;
    let emailError = null;
    
    // If the status is being changed to 'confirmed', send confirmation email
    if (updates.status === 'confirmed' && updatedOrder) {
      console.log('Status is confirmed, attempting to send email...');
      console.log('Order email:', updatedOrder.email);
      
      try {
        // Fetch the service details
        console.log('Fetching service details for serviceid:', updatedOrder.serviceid);
        const { data: service, error: serviceError } = await supabaseAdmin
          .from('services')
          .select('*')
          .eq('id', updatedOrder.serviceid)
          .single();

        if (serviceError) {
          console.error('Failed to fetch service details:', serviceError);
          emailError = `Failed to fetch service details: ${serviceError.message}`;
        } else if (service) {
          console.log('Service details fetched:', service);
          // Use the actual email from the order
          const customerEmail = updatedOrder.email;
          console.log('Sending email to:', customerEmail);
          
          await sendOrderConfirmationEmail(updatedOrder, service, customerEmail);
          console.log('Order confirmation email sent successfully');
          emailSent = true;
        } else {
          console.log('No service found for serviceid:', updatedOrder.serviceid);
          emailError = 'Service not found';
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        emailError = emailError instanceof Error ? emailError.message : 'Unknown email error';
      }
    } else {
      console.log('Status is not confirmed or no updated order:', updates.status, !!updatedOrder);
      emailError = 'No email sent - status not confirmed';
    }
    
    // Always add email status to the response
    updatedOrder.emailSent = emailSent;
    updatedOrder.emailError = emailError;

    return NextResponse.json(updatedOrder);
  } catch (e: any) {
    console.error('PATCH /api/orders unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('orders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}


