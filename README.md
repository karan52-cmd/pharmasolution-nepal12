# Pharma Solution Nepal

A comprehensive educational platform for pharmacy students, instructors, and administrators.

## Features
- **Role-Based Access:** Student, Instructor, Admin dashboards.
- **Learning:** Video/PDF materials, Download requests.
- **Assessment:** Quizzes, Auto-grading, Result generation.
- **AI Tutor:** Powered by Gemini API.
- **Tools:** Drug Index, Clinical Calculators, Vacancy Hub.
- **Email Notifications:** Password reset using EmailJS.

## Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **EmailJS Setup (For Real Emails):**
    - Sign up at [EmailJS.com](https://www.emailjs.com/).
    - Connect your Gmail service.
    - Create an email template with the message: `Your verification code is {{otp}}`.
    - Get your `Service ID`, `Template ID`, and `Public Key`.

3.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```
    API_KEY=your_google_gemini_api_key
    VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```

5.  **Build for Production:**
    ```bash
    npm run build
    ```

## Deployment

### Vercel
1.  Push this code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect Vite and deploy.
4.  Add ALL the above Environment Variables in the Vercel settings.

### Netlify
1.  Push to GitHub.
2.  New Site from Git in Netlify.
3.  Build command: `npm run build`
4.  Publish directory: `dist`
5.  Add Environment variables in Site Settings.
