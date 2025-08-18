import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST() {
  try {
    console.log('=== TEST SIMPLE EMAIL ===');

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found'
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['test@example.com'],
      subject: 'Test Email from RIII',
      html: '<p>This is a test email from RIII Services.</p>',
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    console.log('Simple email sent successfully:', data);
    return NextResponse.json({
      success: true,
      message: 'Simple test email sent successfully',
      data
    });
  } catch (error: any) {
    console.error('Simple email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
