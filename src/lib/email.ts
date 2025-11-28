import { Resend } from "resend";

// Initialize Resend with API key
// If key is missing, email sending will be skipped (useful for dev without keys)
const resend = process.env.RESEND_API_KEY 
    ? new Resend(process.env.RESEND_API_KEY) 
    : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@toolsail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Send verification email for guest submissions
 */
export async function sendVerificationEmail(email: string, token: string) {
    if (!resend) {
        console.log("Mock sending verification email to:", email, "Token:", token);
        return;
    }

    const verifyUrl = `${APP_URL}/api/submissions/verify?token=${token}`;

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: "Verify your tool submission - Toolsail",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify your submission</h2>
                    <p>Thanks for submitting your tool to Toolsail! Please verify your email address to proceed.</p>
                    <p>
                        <a href="${verifyUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                            Verify Email
                        </a>
                    </p>
                    <p style="color: #666; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Failed to send verification email:", error);
        // Don't throw error to prevent blocking the API response
    }
}

/**
 * Send approval notification email
 */
export async function sendApprovalEmail(email: string, toolName: string, toolUrl: string) {
    if (!resend) {
        console.log("Mock sending approval email to:", email);
        return;
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Your tool "${toolName}" has been approved!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Submission Approved! 🎉</h2>
                    <p>Great news! Your tool <strong>${toolName}</strong> has been approved and is now listed on Toolsail.</p>
                    <p>
                        <a href="${toolUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                            View Tool
                        </a>
                    </p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Failed to send approval email:", error);
    }
}

/**
 * Send rejection notification email
 */
export async function sendRejectionEmail(email: string, toolName: string, reason: string) {
    if (!resend) {
        console.log("Mock sending rejection email to:", email, "Reason:", reason);
        return;
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Update regarding your submission "${toolName}"`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Submission Status Update</h2>
                    <p>Thank you for submitting <strong>${toolName}</strong> to Toolsail.</p>
                    <p>Unfortunately, we are unable to list your tool at this time.</p>
                    <div style="background: #f5f5f5; padding: 16px; border-radius: 6px; margin: 16px 0;">
                        <strong>Reason:</strong><br/>
                        ${reason}
                    </div>
                    <p>Feel free to submit again if you address these issues.</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Failed to send rejection email:", error);
    }
}
