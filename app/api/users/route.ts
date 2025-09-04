import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { User } from '@/lib/types';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET /api/users error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Users fetched:', data?.length || 0, 'users');
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('GET /api/users unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, phone, message, source = 'contact_form' } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, name, phone, message, updated_at')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned (user doesn't exist)
      console.error('Error checking existing user:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let result;
    if (existingUser) {
      // Update existing user with new information
      const updateData: Partial<User> = {
        name,
        phone,
        updated_at: new Date().toISOString(),
      };

      // If there's a new message, append it to existing message or create new
      if (message) {
        const existingMessage = existingUser.message || '';
        const separator = existingMessage ? '\n\n--- New Message ---\n' : '';
        updateData.message = existingMessage + separator + message;
      }

      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('email', email)
        .select('*')
        .single();

      if (updateError) {
        console.error('Failed to update user:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      result = updatedUser;
      console.log('User updated successfully:', updatedUser);
    } else {
      // Create new user
      const newUser: Partial<User> = {
        name,
        email,
        phone,
        message,
        source,
      };

      const { data: createdUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert(newUser)
        .select('*')
        .single();

      if (createError) {
        console.error('Failed to create user:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      result = createdUser;
      console.log('User created successfully:', createdUser);
    }

    return NextResponse.json(result, { status: 200 });

  } catch (e: any) {
    console.error('POST /api/users unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
