import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Expense Tracker</Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg border border-white shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg border border-white shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-50 flex-grow flex items-center justify-center py-16">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Track Your Expenses, Achieve Your Goals</h1>
          <p className="text-xl mb-8">
            Take control of your finances with our easy-to-use expense tracker. Set budget goals, monitor spending, and save more every month.
          </p>
          <div className="space-x-4">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg border border-white shadow-lg hover:bg-blue-700 text-lg">
              Get Started
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg border border-white shadow-lg hover:bg-blue-700 text-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Expense Tracker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* Feature 1 */}
            <div className="p-6 bg-blue-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">📊 Expense Tracking</h3>
              <p className="text-gray-700">
                Easily track your daily expenses and categorize them for better insights into your spending habits.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-blue-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">🎯 Budget Goals</h3>
              <p className="text-gray-700">
                Set monthly budget goals and get alerts when you exceed them, helping you stay on track financially.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-blue-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">🔒 Secure & Private</h3>
              <p className="text-gray-700">
                Your data is securely stored and accessible only to you. We prioritize your privacy and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">About Expense Tracker</h3>
              <p className="text-gray-200">
                Expense Tracker is a powerful tool designed to help you manage your finances effectively. Track expenses, set budget goals, and achieve financial freedom.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-200 hover:text-white">Home</Link></li>
                <li><Link href="/login" className="text-gray-200 hover:text-white">Login</Link></li>
                <li><Link href="/signup" className="text-gray-200 hover:text-white">Signup</Link></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-200">
                Have questions or need support? Reach out to us at:
              </p>
              <p className="text-gray-200 mt-2">
                Email: <a href="mailto:support@expensetracker.com" className="hover:text-white">support@expensetracker.com</a>
              </p>
              <p className="text-gray-200">
                Phone: <a href="tel:+1234567890" className="hover:text-white">+1 (234) 567-890</a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-blue-500 mt-8 pt-8 text-center">
            <p className="text-gray-200">
              &copy; 2025 Expense Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}