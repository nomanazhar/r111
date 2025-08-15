import React from 'react';

interface EmailTemplateProps {
  orderId: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  total: number;
  phone: string;
  address: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  orderId,
  customerName,
  serviceName,
  date,
  time,
  total,
  phone,
  address,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', textAlign: 'center', borderRadius: '8px 8px 0 0' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>RIII Service Confirmation</h1>
    </div>
    
    <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '0 0 8px 8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Hello {customerName},</h2>
      
      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Thank you for choosing RIII! Your order has been confirmed and we're excited to provide you with our exceptional service.
      </p>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <h3 style={{ color: '#1e293b', marginTop: 0, marginBottom: '15px' }}>Order Details</h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Order ID:</span>
            <span style={{ color: '#1e293b' }}>#{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Service:</span>
            <span style={{ color: '#1e293b' }}>{serviceName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Date:</span>
            <span style={{ color: '#1e293b' }}>{date}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Time:</span>
            <span style={{ color: '#1e293b' }}>{time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Phone:</span>
            <span style={{ color: '#1e293b' }}>{phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Address:</span>
            <span style={{ color: '#1e293b' }}>{address}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '15px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Total Amount:</span>
            <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '20px' }}>${total}</span>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #0ea5e9', marginBottom: '20px' }}>
        <h4 style={{ color: '#0c4a6e', marginTop: 0, marginBottom: '10px' }}>What's Next?</h4>
        <ul style={{ color: '#0c4a6e', margin: 0, paddingLeft: '20px' }}>
          <li>Our team will contact you within 24 hours to confirm your appointment</li>
          <li>Please ensure someone is available at the specified address and time</li>
          <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
        </ul>
      </div>
      
      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        We're committed to providing you with the highest quality service. If you have any questions or need to make changes to your order, please don't hesitate to contact us.
      </p>
      
      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Thank you for trusting RIII with your service needs!
      </p>
      
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Best regards,<br />
          The RIII Team
        </p>
      </div>
    </div>
  </div>
);
