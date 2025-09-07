import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const hasApiKey = !!resendApiKey;
    
    console.log('RESEND_API_KEY present route:', hasApiKey);
    return NextResponse.json({
      emailConfigured: hasApiKey,
      apiKeyPresent: hasApiKey,
      message: hasApiKey 
        ? 'Email service is configured and ready to use' 
        : 'RESEND_API_KEY environment variable is not set. Please configure it to enable email notifications.',
      instructions: hasApiKey 
        ? 'Email notifications will be sent when orders are confirmed'
        : 'To enable email notifications:\n1. Sign up at resend.com\n2. Get your API key\n3. Add RESEND_API_KEY to your environment variables'
    });
  } catch (error) {
    return NextResponse.json({
      emailConfigured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check email configuration'
    }, { status: 500 });
  }
}
