import emailjs from '@emailjs/browser';

// These should technically be in environment variables, but for the sake of this setup:
// You must replace these with your actual keys from EmailJS dashboard
const SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID || 'service_id'; // Replace with yours
const TEMPLATE_ID = process.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id'; // Replace with yours
const PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'; // Replace with yours

export const EmailService = {
  sendOTP: async (toEmail: string, otp: string, name: string) => {
    try {
      if (!process.env.VITE_EMAILJS_PUBLIC_KEY) {
        console.warn("EmailJS keys missing. Simulating email send.");
        // Fallback for demo if keys aren't set up
        return true;
      }

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: toEmail,
          to_name: name,
          otp: otp,
          message: `Your password reset verification code is: ${otp}`,
        },
        PUBLIC_KEY
      );
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Could not send verification email. Please check your network.");
    }
  }
};