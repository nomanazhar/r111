import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import type { Order, Service } from '@/lib/types';

// Only initialize Resend if API key is present
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
};

export async function sendOrderConfirmationEmail(
  order: Order,
  service: Service,
  customerEmail: string
) {
  try {
    console.log('sendOrderConfirmationEmail called with:', {
      orderId: order.id,
      customerEmail,
      serviceName: service.name,
      resendApiKey: process.env.RESEND_API_KEY ? 'Present' : 'Missing'
    });

    const resend = getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'RIII Services <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `Order Confirmed - ${service.name} | RIII Services`,
      react: EmailTemplate({
        orderId: order.id,
        customerName: order.customer_name,
        serviceName: service.name,
        date: order.date,
        time: order.time,
        total: order.total,
        phone: order.phone,
        address: order.address,
      }),
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Order confirmation email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}
