import { createEmailTemplate } from "@/email-templates/styles";

export interface PaymentOnTheWayBankTransferData {
  sellerName: string;
  bookTitle: string;
  orderId: string;
}

export const createPaymentOnTheWayBankTransferEmail = (
  data: PaymentOnTheWayBankTransferData
): { subject: string; html: string; text: string } => {
  const subject = `Payment on the way — ReBooked Solutions`;

  const html = createEmailTemplate(
    {
      title: subject,
      headerText: "Payment on the Way",
    },
    `
    <p>Hello ${data.sellerName},</p>
    <p>The buyer has confirmed delivery of <strong>${data.bookTitle}</strong> (Order ID: ${data.orderId.slice(-8)}). Your payment is now being processed.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rebookedsolutions.co.za/seller/orders/${data.orderId}" class="btn">View Order</a>
    </div>
    
    <p style="font-size: 13px; color: #6b7280;">Keep sharing your <strong>ReBooked Mini</strong> — the more you share, the more chances to earn!</p>
    `
  );

  const text = `Payment on the way\n\nHello ${data.sellerName},\n\nThe buyer has confirmed delivery of ${data.bookTitle} (Order ID: ${data.orderId.slice(-8)}). We will process your payment and notify you once released.\n\nView order: https://rebookedsolutions.co.za/seller/orders/${data.orderId}`;

  return { subject, html, text };
};

export const sendPaymentOnTheWayBankTransferEmail = async (
  emailData: PaymentOnTheWayBankTransferData,
  emailService: any
): Promise<void> => {
  const template = createPaymentOnTheWayBankTransferEmail(emailData);

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
