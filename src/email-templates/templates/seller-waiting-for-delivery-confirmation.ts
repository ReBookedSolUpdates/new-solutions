import { createEmailTemplate } from "@/email-templates/styles";

export interface SellerWaitingForDeliveryConfirmationData {
  sellerName: string;
  orderId: string;
  bookTitles: string[];
  deadlineDate: string;
}

export const createSellerWaitingForDeliveryConfirmationEmail = (
  data: SellerWaitingForDeliveryConfirmationData
): { subject: string; html: string; text: string } => {
  const subject = `Waiting for buyer confirmation — ReBooked Solutions`;

  const html = createEmailTemplate(
    {
      title: subject,
      headerText: "⏳ Awaiting Buyer Confirmation",
    },
    `
    <p>Hello ${data.sellerName},</p>
    <p>Your book(s) have been delivered! We're now waiting for the buyer to confirm receipt.</p>
    
    <div class="info-box">
      <p><strong>Order ID:</strong> ${data.orderId.slice(-8)}</p>
      <p><strong>Books:</strong> ${data.bookTitles.join(", ")}</p>
      <p><strong>Buyer Confirmation Deadline:</strong> ${data.deadlineDate}</p>
    </div>
    
    <div class="info-box-success">
      <p><strong>✅ Payment Status:</strong> Once the buyer confirms delivery, your payment will be released to your account within 1-2 business days.</p>
    </div>

    <p><strong>What happens next:</strong></p>
    <ol>
      <li>Buyer has until <strong>${data.deadlineDate}</strong> to confirm receipt</li>
      <li>If they confirm, your payment is released immediately</li>
      <li>If they don't confirm within 48 hours, the order auto-confirms and payment is released</li>
      <li>You'll receive an email notification once payment is processed</li>
    </ol>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rebookedsolutions.co.za/seller/orders/${data.orderId}" class="btn">View Order Details</a>
    </div>
    `
  );

  const text = `Waiting for buyer confirmation\n\nHello ${data.sellerName},\n\nYour book(s) have been delivered and we're awaiting buyer confirmation.\n\nOrder ID: ${data.orderId.slice(-8)}\nBooks: ${data.bookTitles.join(", ")}\nBuyer confirmation deadline: ${data.deadlineDate}\n\nOnce confirmed, your payment will be released within 1-2 business days.\n\nView order: https://rebookedsolutions.co.za/seller/orders/${data.orderId}\n\n— ReBooked Solutions`;

  return { subject, html, text };
};

export const sendSellerWaitingForDeliveryConfirmationEmail = async (
  emailData: SellerWaitingForDeliveryConfirmationData,
  emailService: any
): Promise<void> => {
  const template = createSellerWaitingForDeliveryConfirmationEmail(emailData);

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
