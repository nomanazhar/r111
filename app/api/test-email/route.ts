import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST() {
  try {
    console.log('=== TEST EMAIL START ===');
    console.log('Testing email functionality...');
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length || 0);
    
    // Check if API key is present before proceeding
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'RESEND_API_KEY environment variable is not set',
        message: 'Please set the RESEND_API_KEY environment variable to test email functionality'
      }, { status: 400 });
    }
    console.log('RESEND_API_KEY present:', process.env.RESEND_API_KEY);
    // Create a test order and service
    const testOrder = {
      id: 'test-order-123',
      userid: 'test-user',
      serviceid: 'test-service',
      status: 'confirmed' as const,
      customer_name: 'Test Customer',
      email: 'test@example.com',
      phone: '123-456-7890',
      address: '123 Test Street, Test City',
      date: '2024-01-15',
      time: '14:00',
      total: 99.99,
    };

    const testService = {
      id: 'test-service',
      name: 'Test Service',
      description: 'A test service for email verification',
      price: 99.99,
      discount: 10,
      duration: '2 hours',
      category: 'test-category',
      rating: 5,
      image: 'test-image.jpg',
    };

    console.log('About to call sendOrderConfirmationEmail...');
    await sendOrderConfirmationEmail(testOrder, testService, 'test@example.com');
    console.log('sendOrderConfirmationEmail completed successfully');
    
    console.log('=== TEST EMAIL SUCCESS ===');
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      apiKeyPresent: true
    });
  } catch (error: any) {
    console.error('=== TEST EMAIL ERROR ===');
    console.error('Test email failed:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      apiKeyPresent: !!process.env.RESEND_API_KEY 
    }, { status: 500 });
  }
}
