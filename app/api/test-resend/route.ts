import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    console.log('=== TEST RESEND CLIENT ===');
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found',
        message: 'Please set the RESEND_API_KEY environment variable'
      });
    }
    
    // Try to initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend client initialized successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Resend client initialized successfully',
      apiKeyPresent: true
    });
  } catch (error: any) {
    console.error('Failed to initialize Resend client:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to initialize Resend client'
    }, { status: 500 });
  }
}
