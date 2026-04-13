import { createEmailTemplate } from "@/email-templates/styles";

export interface DeliveryComplaintAcknowledgmentBuyerData {
  buyerName: string;
  orderId: string;
  bookTitle: string;
  feedback: string;
}

export const createDeliveryComplaintAcknowledgmentBuyerEmail = (
  data: DeliveryComplaintAcknowledgmentBuyerData
): { subject: string; html: string; text: string } => {
  const subject = `We've received your report — ReBooked Solutions`;

  const html = createEmailTemplate(
    {
      title: subject,
      headerText: "We've Received Your Report",
    },
    `
    <p>Hello ${data.buyerName},</p>
    <p>Thank you for reporting an issue with your order <strong>${data.orderId.slice(-8)}</strong>. Our support team will contact you shortly to investigate: "<em>${data.feedback.trim()}</em>"</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rebookedsolutions.co.za/orders/${data.orderId}" class="btn">View Order</a>
    </div>
    
    <p style="font-size: 13px; color: #6b7280;">If you need any further assistance, email us at <a href="mailto:support@rebookedsolutions.co.za" class="link">support@rebookedsolutions.co.za</a>.</p>
    `
  );

  const text = `We've received your report\n\nHello ${data.buyerName},\n\nThank you for reporting an issue with your order ${data.orderId.slice(-8)}. Our support team will contact you shortly to investigate: "${data.feedback.trim()}"\n\nView order: https://rebookedsolutions.co.za/orders/${data.orderId}`;

  return { subject, html, text };
};

export const sendDeliveryComplaintAcknowledgmentBuyerEmail = async (
  emailData: DeliveryComplaintAcknowledgmentBuyerData,
  emailService: any
): Promise<void> => {
  const template = createDeliveryComplaintAcknowledgmentBuyerEmail(emailData);

  try {
    await emailService.sendEmail({
      to: emailData.buyerName,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    throw error;
  }
};
