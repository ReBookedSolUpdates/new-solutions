import { createEmailTemplate } from '../styles';
import { supabase } from '@/integrations/supabase/client';

export interface ContactAcknowledgmentData {
  name: string;
  email: string;
  subject: string;
}

export function createContactAcknowledgmentEmail(data: ContactAcknowledgmentData): string {
  return createEmailTemplate(
    {
      title: 'We Received Your Message',
      headerText: '📩 Message Received',
      headerType: 'default',
      headerSubtext: `Thank you for reaching out, ${data.name}!`,
    },
    `
    <p>We've received your message regarding <strong>"${data.subject}"</strong> and our team will get back to you as soon as possible.</p>
    
    <div class="info-box">
      <p style="margin: 0; font-size: 14px;">
        <strong>⏰ Expected response time:</strong> Within 24–48 business hours.<br>
        Our working hours are Monday–Friday, 09:00–17:00 (SAST).
      </p>
    </div>
    
    <p>In the meantime, you can browse our <a href="https://rebookedsolutions.co.za/faq" class="link">FAQ page</a> for quick answers to common questions.</p>
    
    <p>If your matter is urgent, please reply to this email or contact us directly at <a href="mailto:support@rebookedsolutions.co.za" class="link">support@rebookedsolutions.co.za</a>.</p>
    
    <p>We appreciate your patience and look forward to assisting you! 🙏</p>
    `
  );
}

export async function sendContactAcknowledgmentEmail(
  name: string,
  email: string,
  subject: string,
): Promise<void> {
  const html = createContactAcknowledgmentEmail({ name, email, subject });

  await supabase.functions.invoke('send-email', {
    body: {
      to: email,
      subject: `We've received your message – "${subject}"`,
      html,
    },
  });
}
