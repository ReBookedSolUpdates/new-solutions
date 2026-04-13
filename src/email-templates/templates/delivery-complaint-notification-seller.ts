import { createEmailTemplate } from "@/email-templates/styles";

export interface DeliveryComplaintNotificationSellerData {
  sellerName: string;
  orderId: string;
  bookTitle: string;
  buyerName: string;
  feedback: string;
}

export const createDeliveryComplaintNotificationSellerEmail = (
  data: DeliveryComplaintNotificationSellerData
): { subject: string; html: string; text: string } => {
  const subject = `Issue finalising order — ReBooked Solutions`;

  const html = createEmailTemplate(
    {
      title: subject,
      headerText: "Issue Finalising Order",
    },
    `
    <p>Hello ${data.sellerName},</p>
    <p>We encountered an issue while finalising Order ID: <strong>${data.orderId.slice(-8)}</strong> for <strong>${data.bookTitle}</strong>. Our team is investigating and may contact you for more information.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rebookedsolutions.co.za/seller/orders/${data.orderId}" class="btn">View Order</a>
    </div>
    
    <p style="font-size: 13px; color: #6b7280;">If you need any help, email us at <a href="mailto:support@rebookedsolutions.co.za" class="link">support@rebookedsolutions.co.za</a>.</p>
    `
  );

  const text = `Issue finalising order\n\nHello ${data.sellerName},\n\nWe encountered an issue while finalising Order ID: ${data.orderId.slice(-8)} for ${data.bookTitle}. Our team is investigating and may contact you for more information.\n\nView order: https://rebookedsolutions.co.za/seller/orders/${data.orderId}`;

  return { subject, html, text };
};

export const sendDeliveryComplaintNotificationSellerEmail = async (
  emailData: DeliveryComplaintNotificationSellerData,
  emailService: any
): Promise<void> => {
  const template = createDeliveryComplaintNotificationSellerEmail(emailData);

  try {
    await emailService.sendEmail({
      to: emailData.sellerName,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    throw error;
  }
};
