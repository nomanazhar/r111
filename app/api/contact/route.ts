import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Save contact form data to users table
    if (supabaseAdmin) {
      try {
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .upsert({
            name,
            email,
            phone,
            message,
            source: 'contact_form',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'email',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (userError) {
          console.error('Failed to save user data:', userError);
          // Continue with the process even if user save fails
        } else {
          console.log('User data saved successfully:', userData);
        }
      } catch (dbError) {
        console.error('Database error while saving user:', dbError);
        // Continue with the process even if user save fails
      }
    }

    // Log the contact request
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    });

    // Here you can add additional logic to:
    // 1. Send email notification to admin
    // 2. Send to CRM system
    // 3. Send confirmation email to user

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
