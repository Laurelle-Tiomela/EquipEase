import { BookingFormData, Equipment, Booking } from "./enhanced-types";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_EMAIL_API_KEY || "test_key";
    this.apiUrl =
      import.meta.env.VITE_EMAIL_API_URL || "https://api.emailservice.com";
  }

  // Mock email sending for development
  private async sendEmail(
    to: string,
    template: EmailTemplate,
  ): Promise<boolean> {
    console.log("📧 Email sent to:", to);
    console.log("📧 Subject:", template.subject);
    console.log("📧 Content:", template.text);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, integrate with real email service like SendGrid, Mailgun, etc.
    /*
    try {
      const response = await fetch(`${this.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject: template.subject,
          html: template.html,
          text: template.text,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
    */

    return true; // Mock success
  }

  // Booking confirmation email to client
  async sendBookingConfirmation(
    booking: BookingFormData,
    equipment: Equipment,
    bookingId: string,
  ): Promise<boolean> {
    const template = this.generateBookingConfirmationTemplate(
      booking,
      equipment,
      bookingId,
    );
    return this.sendEmail(booking.email, template);
  }

  // Booking notification email to business
  async sendBookingNotification(
    booking: BookingFormData,
    equipment: Equipment,
    bookingId: string,
  ): Promise<boolean> {
    const businessEmail =
      import.meta.env.VITE_BUSINESS_EMAIL || "admin@equipease.com";
    const template = this.generateBookingNotificationTemplate(
      booking,
      equipment,
      bookingId,
    );
    return this.sendEmail(businessEmail, template);
  }

  // Booking approval email to client
  async sendBookingApproval(
    booking: Booking,
    equipment: Equipment,
  ): Promise<boolean> {
    const template = this.generateBookingApprovalTemplate(booking, equipment);
    return this.sendEmail(booking.clientEmail, template);
  }

  // Booking rejection email to client
  async sendBookingRejection(
    booking: Booking,
    equipment: Equipment,
    reason: string,
  ): Promise<boolean> {
    const template = this.generateBookingRejectionTemplate(
      booking,
      equipment,
      reason,
    );
    return this.sendEmail(booking.clientEmail, template);
  }

  // Equipment reminder email
  async sendEquipmentReminder(
    booking: Booking,
    equipment: Equipment,
    reminderType: "pickup" | "return",
  ): Promise<boolean> {
    const template = this.generateEquipmentReminderTemplate(
      booking,
      equipment,
      reminderType,
    );
    return this.sendEmail(booking.clientEmail, template);
  }

  // Template generators
  private generateBookingConfirmationTemplate(
    booking: BookingFormData,
    equipment: Equipment,
    bookingId: string,
  ): EmailTemplate {
    const subject = `Booking Confirmation - ${equipment.name} (#${bookingId})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>EquipEase</h1>
          <h2>Booking Confirmation</h2>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <p>Dear ${booking.clientName},</p>
          
          <p>Thank you for your booking! We've received your request and it's currently being reviewed.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Booking ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Equipment:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${equipment.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Start Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${booking.startDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Duration:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${booking.duration} days</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Destination:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${booking.destination}</td>
              </tr>
            </table>
          </div>
          
          <p>We'll review your booking and get back to you within 24 hours.</p>
          
          <p>If you have any questions, feel free to contact us.</p>
          
          <p>Best regards,<br>The EquipEase Team</p>
        </div>
      </div>
    `;

    const text = `
      EquipEase - Booking Confirmation
      
      Dear ${booking.clientName},
      
      Thank you for your booking! We've received your request and it's currently being reviewed.
      
      Booking Details:
      - Booking ID: ${bookingId}
      - Equipment: ${equipment.name}
      - Start Date: ${booking.startDate}
      - Duration: ${booking.duration} days
      - Destination: ${booking.destination}
      
      We'll review your booking and get back to you within 24 hours.
      
      Best regards,
      The EquipEase Team
    `;

    return { subject, html, text };
  }

  private generateBookingNotificationTemplate(
    booking: BookingFormData,
    equipment: Equipment,
    bookingId: string,
  ): EmailTemplate {
    const subject = `New Booking Request - ${equipment.name} (#${bookingId})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>EquipEase Admin</h1>
          <h2>New Booking Request</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>A new booking request has been submitted and requires your review.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px;"><strong>Booking ID:</strong></td>
                <td style="padding: 8px;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Client:</strong></td>
                <td style="padding: 8px;">${booking.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Phone:</strong></td>
                <td style="padding: 8px;">${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Email:</strong></td>
                <td style="padding: 8px;">${booking.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Equipment:</strong></td>
                <td style="padding: 8px;">${equipment.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Profession:</strong></td>
                <td style="padding: 8px;">${booking.profession}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Destination:</strong></td>
                <td style="padding: 8px;">${booking.destination}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Start Date:</strong></td>
                <td style="padding: 8px;">${booking.startDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Duration:</strong></td>
                <td style="padding: 8px;">${booking.duration} days</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Payment Method:</strong></td>
                <td style="padding: 8px;">${booking.paymentMethod}</td>
              </tr>
            </table>
          </div>
          
          ${
            booking.gratitudeMessage
              ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>Client Message:</h4>
              <p style="font-style: italic;">"${booking.gratitudeMessage}"</p>
            </div>
          `
              : ""
          }
          
          <p>Please review and approve/reject this booking in the admin dashboard.</p>
        </div>
      </div>
    `;

    const text = `
      New Booking Request - ${equipment.name} (#${bookingId})
      
      A new booking request has been submitted:
      
      - Client: ${booking.clientName}
      - Phone: ${booking.phone}
      - Email: ${booking.email}
      - Equipment: ${equipment.name}
      - Start Date: ${booking.startDate}
      - Duration: ${booking.duration} days
      - Destination: ${booking.destination}
      
      ${booking.gratitudeMessage ? `Message: "${booking.gratitudeMessage}"` : ""}
      
      Please review in the admin dashboard.
    `;

    return { subject, html, text };
  }

  private generateBookingApprovalTemplate(
    booking: Booking,
    equipment: Equipment,
  ): EmailTemplate {
    const subject = `Booking Approved - ${equipment.name} (#${booking.id})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
          <h1>EquipEase</h1>
          <h2>🎉 Booking Approved!</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Great news! Your equipment booking has been approved.</p>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3>Next Steps:</h3>
            <ul>
              <li>Our team will contact you shortly to arrange delivery</li>
              <li>Please ensure someone is available at the destination address</li>
              <li>Have your ID and payment ready if paying cash on delivery</li>
            </ul>
          </div>
          
          <p>We look forward to serving you!</p>
          
          <p>Best regards,<br>The EquipEase Team</p>
        </div>
      </div>
    `;

    const text = `
      Booking Approved - ${equipment.name} (#${booking.id})
      
      Great news! Your equipment booking has been approved.
      
      Next Steps:
      - Our team will contact you shortly to arrange delivery
      - Please ensure someone is available at the destination address
      - Have your ID and payment ready if paying cash on delivery
      
      Best regards,
      The EquipEase Team
    `;

    return { subject, html, text };
  }

  private generateBookingRejectionTemplate(
    booking: Booking,
    equipment: Equipment,
    reason: string,
  ): EmailTemplate {
    const subject = `Booking Update - ${equipment.name} (#${booking.id})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
          <h1>EquipEase</h1>
          <h2>Booking Update</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>We regret to inform you that your booking request cannot be fulfilled at this time.</p>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3>Reason:</h3>
            <p>${reason}</p>
          </div>
          
          <p>Please feel free to:</p>
          <ul>
            <li>Browse our other available equipment</li>
            <li>Contact us to discuss alternative options</li>
            <li>Try booking for different dates</li>
          </ul>
          
          <p>We apologize for any inconvenience and look forward to serving you in the future.</p>
          
          <p>Best regards,<br>The EquipEase Team</p>
        </div>
      </div>
    `;

    const text = `
      Booking Update - ${equipment.name} (#${booking.id})
      
      We regret to inform you that your booking request cannot be fulfilled at this time.
      
      Reason: ${reason}
      
      Please feel free to browse our other available equipment or contact us to discuss alternatives.
      
      Best regards,
      The EquipEase Team
    `;

    return { subject, html, text };
  }

  private generateEquipmentReminderTemplate(
    booking: Booking,
    equipment: Equipment,
    reminderType: "pickup" | "return",
  ): EmailTemplate {
    const isPickup = reminderType === "pickup";
    const subject = `Equipment ${isPickup ? "Delivery" : "Return"} Reminder - ${equipment.name}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
          <h1>EquipEase</h1>
          <h2>${isPickup ? "🚛" : "📅"} ${isPickup ? "Delivery" : "Return"} Reminder</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>This is a friendly reminder about your equipment ${isPickup ? "delivery" : "return"}.</p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Equipment: ${equipment.name}</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>${isPickup ? "Delivery" : "Return"} Date:</strong> ${isPickup ? booking.startDate : booking.endDate}</p>
          </div>
          
          ${
            isPickup
              ? `
            <p>Our delivery team will arrive at your specified location. Please ensure:</p>
            <ul>
              <li>Someone is available to receive the equipment</li>
              <li>The delivery area is accessible</li>
              <li>Payment is ready if paying cash on delivery</li>
            </ul>
          `
              : `
            <p>Please prepare for equipment return:</p>
            <ul>
              <li>Clean the equipment before return</li>
              <li>Ensure all attachments/accessories are included</li>
              <li>Be available at the agreed return time</li>
            </ul>
          `
          }
          
          <p>If you need to reschedule, please contact us as soon as possible.</p>
          
          <p>Thank you for choosing EquipEase!</p>
        </div>
      </div>
    `;

    const text = `
      Equipment ${isPickup ? "Delivery" : "Return"} Reminder - ${equipment.name}
      
      This is a friendly reminder about your equipment ${isPickup ? "delivery" : "return"}.
      
      Equipment: ${equipment.name}
      Booking ID: ${booking.id}
      ${isPickup ? "Delivery" : "Return"} Date: ${isPickup ? booking.startDate : booking.endDate}
      
      ${
        isPickup
          ? "Please ensure someone is available to receive the equipment and payment is ready if paying cash on delivery."
          : "Please clean the equipment and ensure all accessories are included for return."
      }
      
      Thank you for choosing EquipEase!
    `;

    return { subject, html, text };
  }
}

// Export singleton instance
export const emailService = new EmailService();
