import { createEmailTemplate } from "@/email-templates/styles";

export interface DeliveryConfirmedBuyerData {
  buyerName: string;
  bookTitle: string;
  orderId: string;
}

export const createDeliveryConfirmedBuyerEmail = (
  data: DeliveryConfirmedBuyerData
): { subject: string; html: string; text: string } => {
  const subject = `Thank you — Order Received`;

  const html = createEmailTemplate(
    {
      title: subject,
      headerText: "Thank you — Order Received",
    },
    `
    <p>Hello ${data.buyerName},</p>
    <p>Thanks for shopping with us! We hope you enjoy <strong>${data.bookTitle}</strong>.</p>
    <p>When you're done with it, you can list it on ReBooked Solutions and make your money back. Buy smart, sell smart — keep the cycle going. ♻️</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rebookedsolutions.co.za/orders/${data.orderId}" class="btn">View Your Order</a>
    </div>
    
    <p style="font-size: 13px; color: #6b7280;">Share ReBooked with your friends & family so they can save too. Together we make textbooks affordable.</p>
    `
  );

  const text = `Thank you — Order Received\n\nHello ${data.buyerName},\n\nThanks for confirming receipt of ${data.bookTitle}. We will release payment to the seller shortly.\n\nView order: https://rebookedsolutions.co.za/orders/${data.orderId}\n\n— ReBooked Solutions`;

  return { subject, html, text };
};

export const sendDeliveryConfirmedBuyerEmail = async (
  emailData: DeliveryConfirmedBuyerData,
  emailService: any
): Promise<void> => {
  const template = createDeliveryConfirmedBuyerEmail(emailData);

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
