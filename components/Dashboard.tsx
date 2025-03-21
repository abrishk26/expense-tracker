"use client";

import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { supabase } from "@/lib/supabaseClient";
import Cookies from "js-cookie"; // Import js-cookie

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to extract user_id from the supabase_session cookie
  const getUserIdFromSession = () => {
    const sessionCookie = Cookies.get("supabase_session");
    if (!sessionCookie) {
      throw new Error("No session found. Please log in.");
    }

    try {
      const sessionData = JSON.parse(sessionCookie);
      return sessionData.user?.id;
    } catch (error) {
      throw new Error("Invalid session data.");
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const userId = getUserIdFromSession();
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", userId);

        if (error) {
          console.error(error);
        } else {
          setExpenses(data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</p>;

  // Group expenses by category
  const categories: { [key: string]: number } = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Sort expenses by date
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pieData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categories),
        backgroundColor: ["#6366F1", "#EF4444", "#FACC15", "#14B8A6", "#F97316"],
        hoverOffset: 10,
      },
    ],
  };

  const barData = {
    labels: sortedExpenses.map((expense) => expense.date),
    datasets: [
      {
        label: "Expenses Over Time",
        data: sortedExpenses.map((expense) => expense.amount),
        backgroundColor: "#6366F1",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        💰 Expense Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Expenses by Category 📊
          </h2>
          <div className="w-[250px] h-[250px]">
            <Pie data={pieData} />
          </div>
        </div>

        {/* Bar Chart - Expenses Over Time */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Expenses Over Time 📅
          </h2>
          <div className="w-[300px] h-[200px]">
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}