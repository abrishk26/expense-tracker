# Expense Tracker

The **Expense Tracker** is a web application I developed as part of my internship application for **Shega**. This project demonstrates my ability to build a full-stack application using modern technologies like **Next.js** and **Supabase**. It showcases my skills in frontend development, backend integration, and database management, all of which are essential for the role I’m applying for.

---

## Project Overview

This app is designed to help users manage their finances effectively by:

- **Tracking Expenses**: Log daily expenses and categorize them (e.g., Food, Transport, Entertainment).
- **Setting Budget Goals**: Define monthly budget goals and monitor spending to stay on track.
- **Viewing Insights**: Get a clear overview of spending habits with easy-to-read charts and reports.

---

## Key Features

- **User Authentication**: Secure sign-up and login functionality using Supabase Auth.
- **Expense Management**: Add, edit, or delete expenses with a simple and intuitive interface.
- **Budget Tracking**: Set monthly budget goals and track progress in real-time.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

---

## Technologies Used

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Database**: PostgreSQL (with Row Level Security for data privacy)
- **Deployment**: Vercel (for frontend) and Supabase (for backend)

---

## How It Works

1. **Sign Up or Log In**: Users can create an account or log in to their existing one.
2. **Add Expenses**: Users can log expenses with details like amount, category, and date.
3. **Set Budgets**: Users can define monthly budget goals for different categories.
4. **Track Spending**: Users can view their spending trends and budget progress on the dashboard.

---

---

## Contact

If you have any questions or would like to discuss this project further, feel free to reach out:

- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **GitHub**: [your-username](https://github.com/your-username)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

## Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-project-name.git
   cd your-project-name
2. **Install Dependencies**:
   ```npm install``
3. **Create a .env.local file and add the following environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://avlripcdwwcrbmnbnrbn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bHJpcGNkd3djcmJtbmJucmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzI1MzksImV4cCI6MjA1ODA0ODUzOX0.KDHvLR0De9ce_nPQQ1iySFettJUFmoEZyaG_NMpdidk
   ```
4. **Run the development server**:
   ```npm run dev``