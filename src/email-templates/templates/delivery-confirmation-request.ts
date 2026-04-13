import { createEmailTemplate } from "@/email-templates/styles";

export interface DeliveryConfirmationRequestData {
  buyerName: string;
  orderId: string;
  bookTitles?: string[];
  bookTitle?: string;
  deadlineDate?: string;
}

export const createDeliveryConfirmationRequestEmail = (
  data: DeliveryConfirmationRequestData
): { subject: string; html: string; text: string } => {
  const subject = `Confirm your delivery — ReBooked Solutions`;
  const bookList = data.bookTitles?.length ? data.bookTitles.join(", ") : data.bookTitle || "your book(s)";
  const deadline = data.deadlineDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-ZA");

  const html = createEmailTemplate(
    {
      title: subject,
      headerText: "📦 Did You Receive Your Books?",
    },
    `
    <p>Hello ${data.buyerName},</p>
    <p>We believe your order has been delivered. Please confirm that you've received your book(s):</p>
    
    <div class="info-box">
      <p><strong>Order ID:</strong> ${data.orderId.slice(-8)}</p>
      <p><strong>Books:</strong> ${bookList}</p>
      <p><strong>Confirm by:</strong> ${deadline}</p>
    </div>
    
    <p><strong>Why we need this confirmation:</strong></p>
    <ul>
      <li>Confirms the seller's payment can be released</li>
      <li>Protects you and the seller</li>
      <li>Helps us maintain quality service</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rebookedsolutions.co.za/orders/${data.orderId}?confirm=yes" class="btn" style="background-color: #10b981; margin-right: 10px;">
        Yes, I Received It
      </a>
      <a href="https://rebookedsolutions.co.za/orders/${data.orderId}?confirm=no" class="btn" style="background-color: #dc2626;">
        No, There's an Issue
      </a>
    </div>

    <div class="info-box-warning">
      <p><strong>⏰ Important:</strong> You have until <strong>${deadline}</strong> to confirm. If you don't respond, the order will be automatically confirmed.</p>
    </div>
    `
  );

  const text = `Confirm your delivery\n\nHello ${data.buyerName},\n\nWe believe your order has been delivered. Please confirm receipt:\n\nOrder ID: ${data.orderId.slice(-8)}\nBooks: ${bookList}\nConfirm by: ${deadline}\n\nYes, I received it: https://rebookedsolutions.co.za/orders/${data.orderId}?confirm=yes\nNo, there's an issue: https://rebookedsolutions.co.za/orders/${data.orderId}?confirm=no\n\n— ReBooked Solutions`;

  return { subject, html, text };
};

export const sendDeliveryConfirmationRequestEmail = async (
  emailData: DeliveryConfirmationRequestData,
  emailService: any
): Promise<void> => {
  const template = createDeliveryConfirmationRequestEmail(emailData);

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
