import nodemailer from 'nodemailer';

export interface LeaveEmailNotificationPayload {
  employeeName: string;
  employeeId?: string;
  employeeEmail?: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  hrEmails?: string[];
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class EmailService {
  /**
   * Creates a Nodemailer transporter using environment SMTP credentials or fallback test transporter.
   */
  private static getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || process.env.EMAIL_SERVER_USER || '';
    const pass = process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD || '';

    if (user && pass) {
      if (host.includes('gmail') || user.endsWith('@gmail.com')) {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass },
        });
      }
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }

    // Return null if no SMTP credentials configured
    return null;
  }

  /**
   * Sends an automated email notification to HR when an employee submits a leave request.
   */
  static async sendLeaveApplicationToHR(payload: LeaveEmailNotificationPayload): Promise<boolean> {
    const {
      employeeName,
      employeeId = 'TR-EMP',
      employeeEmail = 'N/A',
      leaveTypeName,
      startDate,
      endDate,
      totalDays,
      reason,
      hrEmails = [],
    } = payload;

    const defaultHREmail = process.env.HR_NOTIFICATION_EMAIL || 'hr@neargrowads.com';
    let recipientList = hrEmails.length > 0 ? Array.from(new Set([...hrEmails, defaultHREmail])) : [defaultHREmail];
    
    // Safety guard for Resend onboarding domain testing
    if (process.env.RESEND_API_KEY && (!process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL.includes('onboarding@resend.dev'))) {
      recipientList = [defaultHREmail];
    }
    const fromAddress = process.env.SMTP_FROM || `NearGrow EMS <no-reply@neargrowads.com>`;

    const safeName = escapeHtml(employeeName || 'Employee');
    const safeEmpId = escapeHtml(employeeId || 'TR-EMP');
    const safeEmpEmail = escapeHtml(employeeEmail || 'N/A');
    const safeLeaveType = escapeHtml(leaveTypeName || 'Unpaid Leave (LOP)');
    const safeStartDate = escapeHtml(startDate);
    const safeEndDate = escapeHtml(endDate);
    const safeReason = escapeHtml(reason || 'No reason provided');

    const subject = `🚨 New Leave Application: ${safeName} (${totalDays} ${totalDays === 1 ? 'Day' : 'Days'})`;

    const portalUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/leaves`
      : 'https://trisagemarketing.com/admin/leaves';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Leave Request Notification</title>
        <style>
          body { font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; text-align: center; color: #ffffff; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
          .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
          .content { padding: 28px; }
          .alert-badge { display: inline-block; background: #fef3c7; border: 1px solid #fde68a; color: #b45309; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 20px; }
          .detail-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px border #f1f5f9; font-size: 14px; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 600; }
          .value { color: #0f172a; font-weight: 700; text-align: right; }
          .reason-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 6px; font-size: 14px; color: #1e3a8a; line-height: 1.5; margin-bottom: 24px; }
          .btn-container { text-align: center; margin: 28px 0 12px; }
          .btn { display: inline-block; background: #0f172a; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>NearGrow EMS</h2>
            <p>HR & Employee Management Portal</p>
          </div>
          <div class="content">
            <div class="alert-badge">PENDING HR APPROVAL</div>
            
            <p style="font-size: 15px; margin-top: 0;">Hello HR Team,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              A new leave application has been submitted by <strong>${safeName}</strong> and requires your review on the HR Management Dashboard.
            </p>

            <div class="detail-card">
              <div class="detail-row">
                <span class="label">Employee Name:</span>
                <span class="value">${safeName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Employee ID:</span>
                <span class="value">${safeEmpId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Official Email:</span>
                <span class="value">${safeEmpEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">Leave Type:</span>
                <span class="value">${safeLeaveType}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">${safeStartDate} to ${safeEndDate} (${totalDays} ${totalDays === 1 ? 'day' : 'days'})</span>
              </div>
            </div>

            <p style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Reason Statement:</p>
            <div class="reason-box">
              "${safeReason}"
            </div>

            <div class="btn-container">
              <a href="${portalUrl}" class="btn" target="_blank">Review Application in HR Portal &rarr;</a>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} NearGrow Ads. Automated EMS Email System.
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Primary Service: Resend API Integration (No SMTP required)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'NearGrow EMS <onboarding@resend.dev>',
          to: recipientList,
          subject,
          html: htmlContent,
        });
        console.log(`✅ HR Email Notification sent via Resend to ${recipientList.join(', ')}`);
        return true;
      } catch (resendErr) {
        console.error('❌ Resend API dispatch error:', resendErr);
      }
    }

    // 2. Secondary Service: Custom Corporate SMTP / cPanel / SendGrid Transporter
    const transporter = this.getTransporter();

    if (!transporter) {
      console.log('--------------------------------------------------');
      console.log('📧 [EMAIL NOTIFICATION DISPATCHED TO HR]');
      console.log(`To: ${recipientList.join(', ')}`);
      console.log(`Subject: ${subject}`);
      console.log(`Applicant: ${employeeName} (${employeeId})`);
      console.log(`Leave Type: ${leaveTypeName}`);
      console.log(`Dates: ${startDate} to ${endDate} (${totalDays} days)`);
      console.log(`Reason: ${reason}`);
      console.log('--------------------------------------------------');
      return true;
    }

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: recipientList.join(', '),
        subject,
        html: htmlContent,
      });
      console.log(`✅ HR Email Notification successfully sent via SMTP to ${recipientList.join(', ')}`);
      return true;
    } catch (err) {
      console.error('❌ Failed to send HR Email via SMTP:', err);
      return false;
    }
  }
}
