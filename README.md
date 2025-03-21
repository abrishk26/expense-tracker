# Expense Tracker

The **Expense Tracker** is a web application I developed as part of my internship application for **Shega**. This project demonstrates my ability to build a full-stack application using modern technologies like **Next.js** and **Supabase**. It showcases my skills in frontend development, backend integration, and database management, all of which are essential for the role I’m applying for.

**Live Demo:** [View the live demo of the project here](https://expense-tracker-app-sjyx.vercel.app/)

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

1. **Sign Up or Log In**:
   - Users can create a new account or log in to an existing one.
   - After signing up, an activation email is sent to the provided email address. **Please wait a few minutes for the email to arrive**.
   - Once the account is activated, users can log in and access their dashboard.

2. **Add Expenses**:
   - Users can log expenses with details such as amount, category, and date.
   - **Note**: Expenses can only be added if a budget for the corresponding category exists.

3. **Set Budgets**:
   - Users can define monthly budget goals for different categories.
   - **Note**: A budget cannot be added again for the same year, month, and category combination.

4. **Track Spending**:
   - Users can view their spending trends and budget progress on the dashboard.
   - The dashboard provides a clear representation of expenses and budgets.

### Additional Notes:
- After a successful login, users remain logged in until they manually log out.
- **Live Demo**: [View the live demo of the project here](https://expense-tracker-app-sjyx.vercel.app/).
---

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
   ```npm install```
3. **Create a .env.local file and add the following environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://avlripcdwwcrbmnbnrbn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bHJpcGNkd3djcmJtbmJucmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzI1MzksImV4cCI6MjA1ODA0ODUzOX0.KDHvLR0De9ce_nPQQ1iySFettJUFmoEZyaG_NMpdidk
   ```
4. **Run the development server**:
   ```npm run dev```

## Contact

If you have any questions or would like to discuss this project further, feel free to reach out:

- **Email**: [abrehmakassa19@gmail.com]
- **GitHub**: [abrishk26](https://github.com/abrishk26)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)