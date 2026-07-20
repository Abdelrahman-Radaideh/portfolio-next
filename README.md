# Modern Portfolio Website & Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A highly customizable, fully responsive portfolio website built with Next.js and TypeScript. It includes a beautiful frontend powered by Framer Motion animations and a secure, fully-featured Admin Dashboard to manage your content dynamically without writing a single line of code.

**Demo:** [View Live Site](https://Abdelrahman Khalid Radaideh-alradaideh.vercel.app)

---

## ✨ Key Features

- **Modern & Responsive UI:** Fully optimized for all devices with Dark/Light mode support.
- **Secure Admin Dashboard:** A hidden dashboard protected by a JWT-based Email OTP system.
- **Full Content Management:** Perform full CRUD operations on your Projects, Skills, Experiences, Education, and Courses.
- **Multi-Portfolio Support:** Create and seamlessly switch between different portfolio profiles (e.g., tailoring one for Software Engineering, another for UI/UX Design).
- **Drag & Drop Reordering:** Easily rearrange the display order of your projects and experiences using interactive drag-and-drop.
- **Analytics Ready:** Built-in integration with PostHog to track visitors and portfolio performance.
- **Export & Import:** Export your entire portfolio to a `.json` file for backups, or import a JSON file to instantly populate your dashboard.
- **Static "Antigravity" Deployment:** Support for exporting data and deploying purely static pages.

---

## 🧰 Tech Stack

| Technology | Role |
|-----------|----------------------------------|
| **Next.js 15+** | React framework for production & routing |
| **TypeScript**| Static typing for robust application logic |
| **Tailwind CSS**| Utility-first CSS styling framework |
| **Framer Motion**| Declarative animation library |
| **Supabase** | PostgreSQL database for storing user data |
| **Cloudinary**| Image hosting and optimization |
| **PostHog** | Product analytics and event tracking |
| **Nodemailer** | Secure backend email functionality for OTP and contact forms |

---

## 🚀 Step-by-Step Setup Guide

Follow these exact steps to fork this repository, set it up, and get your portfolio running on your local machine.

### 1. Clone the Repository
```bash
git clone <your-fork-url>
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Your Environment Variables
You need to set up your keys for the various third-party services used in this project.
1. Copy the template file:
   ```bash
   cp .env.template .env.local
   ```
2. Open `.env.local` and replace the placeholder values (e.g., `xxx`) with your actual credentials. You will need:
   - **Supabase**: URL and Service Role Key (from your Supabase project settings).
   - **Cloudinary**: Cloud Name, API Key, and API Secret.
   - **Email Config**: The email address you want to receive messages at, and an App Password (e.g., Gmail App Password) to allow NodeMailer to send emails.
   - **Security**: Create a random string for `JWT_SECRET` and set a phrase for `NEXT_PUBLIC_SECRET_KEY` (used to trigger the dashboard login).
   - **PostHog (Optional)**: Tokens for analytics.

### 4. Database Setup & Seeding (Supabase)
To prevent the application from crashing when you first launch it, we provide a seed script that creates a temporary placeholder profile.
1. Create a new project in [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open the `src/config/setup-database.sql` file located in this repository.
4. Copy its contents (which includes the table schema and the initial placeholder data), paste them into the SQL Editor, and click **Run**.
5. *Success! Your database now has the correct tables and is populated with placeholder data (Abdelrahman Khalid Radaideh''s Profile, Projects, Skills, etc).*

### 5. Start the Application
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`. You should now see the beautiful placeholder portfolio rendered correctly!

---

## 🔐 Accessing Your Dashboard

The Admin Dashboard is hidden to protect your data. To log in and edit the placeholder data with your actual information:

1. Scroll down to the **Contact** section at the bottom of the homepage.
2. In the "Message" text area, type your secret access code (defined as `NEXT_PUBLIC_SECRET_KEY` in your `.env.local`). Default is: `Abdelrahman Khalid Radaidehopendash`
3. The system will detect the phrase and trigger a secure modal. 
4. A One-Time Password (OTP) will be securely sent to the email address you configured.
5. Enter the OTP code from your email into the modal to authenticate.
6. **Welcome to your Dashboard!** From here, you can update the temporary seeded user with your own picture, name, projects, and experiences.

---

## 📁 Project Structure

```
portfolio/
├── src/                    # Main source code directory
│   ├── actions/            # Next.js Server Actions for secure database mutations
│   ├── app/                # App Router (pages, layouts, API routes, dashboards)
│   ├── components/         # Reusable React UI components
│   ├── lib/                # Database models, services, auth logic, and utilities
│   └── templates/          # Email HTML templates
├── public/                 # Static assets
├── .env.template           # Template for environment variables
├── supabase_seed.sql       # Initial database seeding script
├── package.json            # Project dependencies
└── README.md               # Documentation
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and open a pull request for any new features or bug fixes.

## 📞 Contact
For questions or collaboration opportunities, feel free to reach out to the original author:
- Email: Abdelrahman Khalid Radaidehradaideh.dev@gmail.com
- LinkedIn: [linkedin.com/in/Abdelrahman Khalid Radaideh-radaideh](https://linkedin.com/in/Abdelrahman Khalid Radaideh-radaideh)

⭐ **If you found this template helpful, please give it a star!**