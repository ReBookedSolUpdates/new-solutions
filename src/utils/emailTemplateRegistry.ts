import { EmailTemplate, createEmailTemplate, EMAIL_STYLES, EMAIL_FOOTER } from './emailStyles';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ORDER RELATED EMAILS
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    description: 'Sent to buyer after successful payment',
    category: 'orders',
    requiredFields: ['customerName', 'orderNumber', 'items', 'total'],
    defaultData: {
      customerName: 'John Doe',
      orderNumber: 'ORD-12345',
      items: [
        { name: 'Physics Textbook Grade 12', quantity: 1, price: 250 },
        { name: 'Mathematics Study Guide', quantity: 1, price: 180 }
      ],
      total: '430.00',
      estimatedDelivery: '3-5 business days'
    },
    generator: (data) => ({
      subject: `Order Confirmation - ${data.orderNumber} - ReBooked Marketplace`,
      html: createEmailTemplate(
        {
          title: 'Order Confirmation - ReBooked Marketplace',
          headerText: '🎉 Order Confirmed!',
          headerSubtext: `Thank you for your purchase, ${data.customerName}!`
        },
        `
        <h2>Order #${data.orderNumber}</h2>
        <p>Your order has been confirmed and is being processed.</p>
        
        <h3>Order Details:</h3>
        ${data.items.map((item: any) => `
          <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
            <strong>${item.name}</strong><br>
            Quantity: ${item.quantity} × R${item.price}<br>
            Subtotal: R${(item.quantity * item.price).toFixed(2)}
          </div>
        `).join('')}
        
        <div class="total">
          <p>Total: R${data.total}</p>
        </div>
        
        ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
        
        <p>We'll send you another email when your order ships with tracking information.</p>
        
        <a href="https://rebookedsolutions.co.za/orders/${data.orderNumber}" class="btn">Track Your Order</a>
        `
      ),
      text: `Order Confirmed!\n\nThank you for your purchase, ${data.customerName}!\n\nOrder #${data.orderNumber}\n\nTotal: R${data.total}\n\nWe'll send you tracking information when your order ships.`
    })
  },

  {
    id: 'payment-confirmation-receipt',
    name: 'Payment Confirmation Receipt',
    description: 'Custom receipt with detailed next steps after payment',
    category: 'orders',
    requiredFields: ['customerName', 'orderId', 'bookTitle', 'totalPaid'],
    defaultData: {
      customerName: 'Jane Smith',
      orderId: 'ORD-67890',
      bookTitle: 'Chemistry Textbook Grade 11',
      totalPaid: 320.00,
      deliveryMethod: 'Standard Delivery',
      paymentReference: 'PAY-ABC123'
    },
    generator: (data) => ({
      subject: `🎉 Payment Confirmed - Receipt for ${data.bookTitle} - ReBooked`,
      html: createEmailTemplate(
        {
          title: 'Payment Confirmed - ReBooked Marketplace',
          headerText: '🎉 Payment Confirmed!',
          headerSubtext: 'Your order is being processed'
        },
        `
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px;">Receipt Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Order ID</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${data.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Item</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 500; text-align: right;">${data.bookTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Payment Ref</td>
              <td style="padding: 8px 0; color: #0f172a; font-family: monospace; text-align: right;">${data.paymentReference}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 16px 0 0 0; color: #0f172a; font-weight: 700; font-size: 18px;">Total Paid</td>
              <td style="padding: 16px 0 0 0; color: #059669; font-weight: 700; font-size: 18px; text-align: right;">R${data.totalPaid.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #0f172a; font-size: 18px; margin-bottom: 16px;">📦 What happens next?</h3>
          
          <div style="display: flex; margin-bottom: 20px;">
            <div style="min-width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 16px;">1</div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a;">Seller Confirmation</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">The seller has 48 hours to commit to your order. If they don't, you'll receive a full refund automatically.</p>
            </div>
          </div>

          <div style="display: flex; margin-bottom: 20px;">
            <div style="min-width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 16px;">2</div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a;">Courier Pickup</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">Once confirmed, we schedule a courier to pick up the item. We'll email you the tracking details immediately.</p>
            </div>
          </div>

          <div style="display: flex;">
            <div style="min-width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 16px;">3</div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a;">Safe Delivery</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">Your book will be delivered within 2-3 business days. Remember to confirm receipt in your dashboard!</p>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://rebookedsolutions.co.za/orders/${data.orderId}" style="background-color: #3b82f6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">View Order Status</a>
        </div>
        `
      ),
      text: `Payment Confirmed!\n\nOrder ID: ${data.orderId}\nItem: ${data.bookTitle}\nTotal Paid: R${data.totalPaid.toFixed(2)}\n\nNext steps:\n1. Seller confirms order (48h)\n2. Courier pickup\n3. Delivery (2-3 days)\n\nTrack here: https://rebookedsolutions.co.za/orders/${data.orderId}`
    })
  },
  {
    id: 'order-commitment-confirmed',
    name: 'Order Commitment Confirmation',
    description: 'Sent to buyer and seller when seller commits to the sale',
    category: 'orders',
    requiredFields: ['recipientName', 'role', 'orderId', 'bookTitle', 'trackingNumber'],
    defaultData: {
      recipientName: 'Alex',
      role: 'buyer',
      orderId: 'ORD-123',
      bookTitle: 'Maths Grade 12',
      trackingNumber: 'TCG123456789',
      trackingUrl: 'https://tcg.co.za/track/TCG123456789'
    },
    generator: (data) => ({
      subject: `🚚 ${data.role === 'buyer' ? 'Your order is on its way!' : 'Shipment scheduled for your sale'} - ReBooked`,
      html: createEmailTemplate(
        {
          title: 'Order Status Update',
          headerText: data.role === 'buyer' ? '📦 Order Confirmed & Shipping!' : '🚀 Shipment Scheduled!',
          headerSubtext: `Order #${data.orderId} - ${data.bookTitle}`
        },
        `
        <p>Hello ${data.recipientName},</p>
        <p>${data.role === 'buyer' 
          ? 'The seller has confirmed your order and a courier pickup has been scheduled.' 
          : 'You have successfully committed to the sale. We have scheduled a courier pickup for your item.'}</p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 10px 0; color: #166534;">Tracking Information</h3>
          <p style="margin: 0; color: #166534;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
          <p style="margin: 10px 0 0 0; color: #166534;">The courier will collect the package shortly. You can track the progress using the link below.</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.trackingUrl || '#'}" style="background-color: #10b981; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Track Shipment Progress</a>
        </div>

        <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; border: 1px solid #bfdbfe;">
          <h4 style="margin: 0 0 10px 0; color: #1e40af;">Summary</h4>
          <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>Item:</strong> ${data.bookTitle}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e40af;"><strong>Order ID:</strong> ${data.orderId}</p>
        </div>
        `
      ),
      text: `${data.role === 'buyer' ? 'Order Confirmed!' : 'Shipment Scheduled!'}\n\nTracking Number: ${data.trackingNumber}\nOrder: ${data.bookTitle}\nID: ${data.orderId}`
    })
  },

  {
    id: 'order-declined',
    name: 'Order Declined Notification',
    description: 'Sent to buyer when seller declines their order',
    category: 'orders',
    requiredFields: ['customerName', 'orderId', 'reason', 'totalAmount'],
    defaultData: {
      customerName: 'Mike Johnson',
      orderId: 'ORD-54321',
      reason: 'Book no longer available',
      totalAmount: 280.00,
      refundStatus: 'processed',
      refundReference: 'REF-ABC789'
    },
    generator: (data) => ({
      subject: 'Order Declined - Refund Processed - ReBooked Marketplace',
      html: createEmailTemplate(
        {
          title: 'Order Declined - Refund Processed',
          headerType: 'error',
          headerText: '❌ Order Declined'
        },
        `
        <p>Hello ${data.customerName},</p>
        <p>We're sorry to inform you that your order has been declined by the seller.</p>

        <div class="info-box-error">
          <h3>📋 Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Amount:</strong> R${data.totalAmount.toFixed(2)}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>

        <div class="info-box-success">
          <h3>💰 Refund Information</h3>
          <p><strong>Refund Status:</strong> ${data.refundStatus}</p>
          <p><strong>Refund Reference:</strong> ${data.refundReference}</p>
          <p><strong>Processing Time:</strong> 3-5 business days</p>
          <p><strong>✅ Your refund has been successfully processed.</strong></p>
        </div>

        <p>We apologize for any inconvenience. Please feel free to browse our marketplace for similar books from other sellers.</p>

        <a href="https://rebookedsolutions.co.za/books" class="btn">Browse Books</a>
        `
      ),
      text: `Order Declined\n\nHello ${data.customerName},\n\nYour order has been declined by the seller.\n\nOrder ID: ${data.orderId}\nAmount: R${data.totalAmount.toFixed(2)}\nReason: ${data.reason}\n\nYour refund has been processed and will appear in your account within 3-5 business days.`
    })
  },

  // AUTHENTICATION EMAILS
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    description: 'Premium welcome email for new users',
    category: 'auth',
    requiredFields: ['userName'],
    defaultData: {
      userName: 'Alex Parker',
      loginUrl: 'https://rebookedsolutions.co.za/profile'
    },
    generator: (data) => ({
      subject: 'Welcome to the ReBooked Family! 📚✨',
      html: createEmailTemplate(
        {
          title: 'Welcome to ReBooked Marketplace',
          headerText: '🎉 Welcome to ReBooked!',
          headerSubtext: `We're thrilled to have you here, ${data.userName}!`
        },
        `
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="font-size: 18px; color: #475569; line-height: 1.6;">Your journey to affordable learning and sustainable student living starts here.</p>
        </div>

        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;">📖 Browse Listings</h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Find textbooks, uniforms, and supplies at a fraction of the cost.</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;">💰 Sell Your Items</h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Turn your old books into cash and help another student out.</p>
          </div>
        </div>

        <div style="background-color: #eff6ff; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid #bfdbfe;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af;">Complete Your Profile</h3>
          <p style="margin: 0 0 20px 0; color: #1e40af; font-size: 15px;">Add your phone number and address to start buying and selling immediately.</p>
          <a href="https://rebookedsolutions.co.za/profile" style="background-color: #3b82f6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Go to Profile</a>
        </div>

        <p style="margin-top: 32px; color: #94a3b8; font-size: 12px; text-align: center;">ReBooked Solutions - Empowering South African Students</p>
        `
      ),
      text: `Welcome to ReBooked!\n\nHello ${data.userName}!\n\nWelcome to the community. You can now browse affordable textbooks and sell your items.\n\nComplete your profile here: https://rebookedsolutions.co.za/profile`
    })
  },
  {
    id: 'order-cancelled',
    name: 'Order Cancelled Notification',
    description: 'Sent to both parties when an order is cancelled',
    category: 'orders',
    requiredFields: ['recipientName', 'role', 'orderId', 'bookTitle', 'cancelledBy'],
    defaultData: {
      recipientName: 'Alex',
      role: 'buyer',
      orderId: 'ORD-123',
      bookTitle: 'Maths Grade 12',
      cancelledBy: 'seller',
      reason: 'Out of stock'
    },
    generator: (data) => ({
      subject: `⚠️ Order Cancelled: ${data.bookTitle} - ReBooked`,
      html: createEmailTemplate(
        {
          title: 'Order Cancelled',
          headerType: 'error',
          headerText: '⚠️ Order Cancelled',
          headerSubtext: `Order #${data.orderId}`
        },
        `
        <p>Hello ${data.recipientName},</p>
        <p>We are notifying you that the order for <strong>${data.bookTitle}</strong> has been cancelled by the ${data.cancelledBy}.</p>

        <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 10px 0; color: #9a3412;">Refund Information</h3>
          ${data.role === 'buyer' 
            ? '<p style="margin: 0; color: #9a3412;">A full refund has been initiated to your original payment method. It may take 3-5 business days to reflect in your account.</p>' 
            : '<p style="margin: 0; color: #9a3412;">As the seller, no further action is required for this order.</p>'}
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://rebookedsolutions.co.za/browse" style="background-color: #475569; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Continue Browsing</a>
        </div>
        `
      ),
      text: `Order Cancelled\n\nOrder #${data.orderId} for ${data.bookTitle} has been cancelled by the ${data.cancelledBy}.`
    })
  },
  {
    id: 'order-delivered-buyer',
    name: 'Order Delivered (Buyer Confirmation)',
    description: 'Sent to buyer when courier marks order as delivered',
    category: 'orders',
    requiredFields: ['buyerName', 'orderId', 'bookTitle'],
    defaultData: {
      buyerName: 'John',
      orderId: 'ORD-123',
      bookTitle: 'Maths Grade 12'
    },
    generator: (data) => ({
      subject: `🎁 Delivered! Please confirm your order - ReBooked`,
      html: createEmailTemplate(
        {
          title: 'Order Delivered',
          headerText: '🎁 Item Delivered!',
          headerSubtext: `Confirmation required for Order #${data.orderId}`
        },
        `
        <p>Hello ${data.buyerName},</p>
        <p>Our records show that your item <strong>${data.bookTitle}</strong> has been delivered!</p>

        <div style="background-color: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <h3 style="margin: 0 0 12px 0; color: #0369a1;">Final Step: Confirm Receipt</h3>
          <p style="margin: 0 0 20px 0; color: #0369a1; font-size: 15px;">Please verify that you have received the item in the described condition so we can release the payment to the seller.</p>
          <a href="https://rebookedsolutions.co.za/orders/${data.orderId}" style="background-color: #0ea5e9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">I've Received It</a>
        </div>

        <p style="font-size: 14px; color: #64748b; text-align: center;">If there are any issues with the item, please report them immediately in your dashboard.</p>
        `
      ),
      text: `Item Delivered!\n\nPlease confirm receipt of your order ${data.orderId} (${data.bookTitle}) at: https://rebookedsolutions.co.za/orders/${data.orderId}`
    })
  },
  {
    id: 'chat-notification',
    name: 'New Message Notification',
    description: 'Sent to users when they receive a new chat message',
    category: 'notifications',
    requiredFields: ['recipientName', 'senderName', 'messageSnippet'],
    defaultData: {
      recipientName: 'Alex',
      senderName: 'Sarah',
      messageSnippet: 'Is the book still available?',
      chatUrl: 'https://rebookedsolutions.co.za/profile?tab=messages'
    },
    generator: (data) => ({
      subject: `💬 New message from ${data.senderName} - ReBooked`,
      html: createEmailTemplate(
        {
          title: 'New Message',
          headerText: '💬 New Message',
          headerSubtext: `You have a new message on ReBooked`
        },
        `
        <p>Hello ${data.recipientName},</p>
        <p><strong>${data.senderName}</strong> sent you a new message:</p>

        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; margin: 24px 0;">
          <p style="margin: 0; font-style: italic; color: #334155;">"${data.messageSnippet}"</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.chatUrl || 'https://rebookedsolutions.co.za/profile?tab=messages'}" style="background-color: #3b82f6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reply Now</a>
        </div>
        `
      ),
      text: `New message from ${data.senderName}\n\n"${data.messageSnippet}"\n\nReply at: https://rebookedsolutions.co.za/profile?tab=messages`
    })
  },

  {
    id: 'email-verification',
    name: 'Email Verification',
    description: 'Email verification for new accounts',
    category: 'auth',
    requiredFields: ['userName', 'verificationUrl'],
    defaultData: {
      userName: 'Sarah Wilson',
      verificationUrl: 'https://rebookedsolutions.co.za/verify?token=abc123',
      expiryTime: '24 hours'
    },
    generator: (data) => ({
      subject: 'Verify Your Email Address - ReBooked Marketplace',
      html: createEmailTemplate(
        {
          title: 'Verify Your Email - ReBooked Marketplace',
          headerText: '📧 Verify Your Email Address'
        },
        `
        <h2>Hello ${data.userName}!</h2>
        <p>Welcome to ReBooked Marketplace! To complete your registration and start buying and selling textbooks, please verify your email address.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" class="btn">Verify My Email Address</a>
        </div>

        <p><strong>This verification link will expire in ${data.expiryTime || '24 hours'}.</strong></p>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${data.verificationUrl}
        </p>

        <p style="font-size: 14px; color: #666;">
          If you didn't create an account with ReBooked Marketplace, please ignore this email.
        </p>
        `
      ),
      text: `Verify Your Email Address\n\nHello ${data.userName}!\n\nPlease verify your email: ${data.verificationUrl}\n\nThis link expires in ${data.expiryTime || '24 hours'}.`
    })
  },

  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Password reset email',
    category: 'auth',
    requiredFields: ['resetUrl'],
    defaultData: {
      userName: 'David Brown',
      resetUrl: 'https://rebookedsolutions.co.za/reset-password?token=xyz789'
    },
    generator: (data) => ({
      subject: 'Password Reset Request - ReBooked Marketplace',
      html: createEmailTemplate(
        {
          title: 'Password Reset - ReBooked Marketplace',
          headerText: '🔐 Password Reset Request'
        },
        `
        <h2>Hello ${data.userName || 'User'}!</h2>
        <p>We received a request to reset your password for your ReBooked Marketplace account.</p>
        
        <div class="info-box">
          <h3>Reset Your Password</h3>
          <p>Click the button below to reset your password. This link will expire in 24 hours.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" class="btn">Reset Password</a>
        </div>
        
        <p>If you didn't request this password reset, please ignore this email.</p>
        `
      ),
      text: `Password Reset Request\n\nHello ${data.userName || 'User'}!\n\nReset your password: ${data.resetUrl}\n\nThis link expires in 24 hours.`
    })
  },

  // NOTIFICATION EMAILS
  {
    id: 'seller-new-order',
    name: 'New Order Notification (Seller)',
    description: 'Notifies seller of new order requiring commitment',
    category: 'notifications',
    requiredFields: ['sellerName', 'buyerName', 'orderId', 'totalAmount'],
    defaultData: {
      sellerName: 'Emma Davis',
      buyerName: 'Tom Wilson',
      orderId: 'ORD-99999',
      totalAmount: '450.00',
      expiresAt: '48 hours',
      items: [{ name: 'Biology Textbook Grade 12', quantity: 1, price: 450 }]
    },
    generator: (data) => ({
      subject: 'New Order - Action Required - ReBooked Marketplace',
      html: createEmailTemplate(
        {
          title: 'New Order - Action Required',
          headerText: '🔔 New Order Received!',
          headerSubtext: `Hello ${data.sellerName}!`
        },
        `
        <p>Great news! You have received a new order from ${data.buyerName}.</p>

        <div class="info-box">
          <h3>📋 Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Buyer:</strong> ${data.buyerName}</p>
          <p><strong>Total Amount:</strong> R${data.totalAmount}</p>
          ${data.items ? data.items.map((item: any) => `<p><strong>Item:</strong> ${item.name} (R${item.price})</p>`).join('') : ''}
        </div>

        <div class="info-box-warning">
          <h3>⏰ Action Required</h3>
          <p><strong>You have ${data.expiresAt} to commit to this order.</strong></p>
          <p>If you don't respond within this time, the order will be automatically cancelled and the buyer will be refunded.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://rebookedsolutions.co.za/seller/orders/${data.orderId}" class="btn">Review Order & Commit</a>
        </div>
        `
      ),
      text: `New Order - Action Required\n\nHello ${data.sellerName}!\n\nNew order from ${data.buyerName}\nOrder ID: ${data.orderId}\nTotal: R${data.totalAmount}\n\nYou have ${data.expiresAt} to commit. Review at: https://rebookedsolutions.co.za/seller/orders/${data.orderId}`
    })
  },

  // BANKING EMAILS  
  {
    id: 'banking-setup-success',
    name: 'Banking Setup Success',
    description: 'Confirms successful banking setup',
    category: 'banking',
    requiredFields: ['userName', 'subaccountCode'],
    defaultData: {
      userName: 'Lisa Chen',
      subaccountCode: 'ACCT_123456789',
      businessName: 'Lisa\'s Books'
    },
    generator: (data) => ({
      subject: 'Banking Setup Completed - ReBooked Marketplace',
      html: createEmailTemplate(
        {
          title: 'Banking Setup Completed',
          headerText: '🏦 Banking Setup Complete!',
          headerSubtext: `Hello ${data.userName}!`
        },
        `
        <p>Your banking details have been successfully set up on ReBooked Marketplace.</p>

        <div class="info-box-success">
          <h3>✅ Setup Complete</h3>
          <p><strong>Business Name:</strong> ${data.businessName}</p>
          <p><strong>Subaccount Code:</strong> ${data.subaccountCode}</p>
          <p><strong>Commission Rate:</strong> 10% (You keep 90%)</p>
        </div>

        <div class="info-box">
          <h3>💰 How Payments Work</h3>
          <ul>
            <li>Payments are held in escrow until delivery confirmation</li>
            <li>Funds are released to your account within 1-2 business days after delivery</li>
            <li>All transactions are processed securely through our payment system</li>
          </ul>
        </div>

        <p>You can now start selling books and receive payments directly to your bank account!</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://rebookedsolutions.co.za/sell" class="btn">Start Selling Books</a>
        </div>
        `
      ),
      text: `Banking Setup Complete!\n\nHello ${data.userName}!\n\nYour banking details are set up.\nSubaccount: ${data.subaccountCode}\n\nYou can now sell books and receive payments to your bank account.`
    })
  }
];

export function getTemplateById(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(template => template.category === category);
}

export function getAllTemplateCategories(): string[] {
  return [...new Set(EMAIL_TEMPLATES.map(template => template.category))];
}
