"use client";

import { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { supabase } from "@/lib/supabaseClient";
import Cookies from "js-cookie";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface BudgetGoal {
  id: string;
  month: number;
  year: number;
  category: string;
  goal_amount: number;
  user_id: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
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

  // Fetch expenses and budget goals on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserIdFromSession();
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", userId);

        const { data: budgetData, error: budgetError } = await supabase
          .from("budget_goals")
          .select("*")
          .eq("user_id", userId);

        if (expensesError || budgetError) {
          console.error("Error fetching data:", expensesError || budgetError);
        } else {
          setExpenses(expensesData || []);
          setBudgetGoals(budgetData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</p>;

  // Group expenses by category
  const categories: { [key: string]: number } = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Sort expenses by date
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pie Chart - Category Breakdown
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

  // Bar Chart - Expenses Over Time
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

  // Monthly Spending Trends
  const monthlySpending = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const monthlyData = {
    labels: Object.keys(monthlySpending),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlySpending),
        borderColor: "#6366F1",
        backgroundColor: "#6366F1",
        fill: false,
      },
    ],
  };

  // Top Spending Categories
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topCategoriesData = {
    labels: sortedCategories.map(([category]) => category),
    datasets: [
      {
        label: "Top Spending Categories",
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: ["#6366F1", "#EF4444", "#FACC15", "#14B8A6", "#F97316"],
      },
    ],
  };

  // Budget vs. Actual Spending
  const budgetComparisonData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Budget",
        data: Object.keys(categories).map((category) => {
          const budget = budgetGoals.find((goal) => goal.category === category);
          return budget ? budget.goal_amount : 0;
        }),
        backgroundColor: "#14B8A6",
      },
      {
        label: "Actual Spending",
        data: Object.values(categories),
        backgroundColor: "#6366F1",
      },
    ],
  };

  // Spending Distribution by Day of the Week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const spendingByDay = expenses.reduce((acc, expense) => {
    const day = new Date(expense.date).getDay();
    acc[daysOfWeek[day]] = (acc[daysOfWeek[day]] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const spendingByDayData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Spending by Day of the Week",
        data: daysOfWeek.map((day) => spendingByDay[day] || 0),
        backgroundColor: "#6366F1",
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

        {/* Line Chart - Monthly Spending Trends */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Monthly Spending Trends 📈
          </h2>
          <div className="w-[300px] h-[200px]">
            <Line data={monthlyData} />
          </div>
        </div>

        {/* Bar Chart - Top Spending Categories */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Top Spending Categories 🏆
          </h2>
          <div className="w-[300px] h-[200px]">
            <Bar data={topCategoriesData} options={{ indexAxis: "y" }} />
          </div>
        </div>

        {/* Bar Chart - Budget vs. Actual Spending */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Budget vs. Actual Spending 💸
          </h2>
          <div className="w-[300px] h-[200px]">
            <Bar data={budgetComparisonData} />
          </div>
        </div>

        {/* Bar Chart - Spending by Day of the Week */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Spending by Day of the Week 📅
          </h2>
          <div className="w-[300px] h-[200px]">
            <Bar data={spendingByDayData} />
          </div>
        </div>
      </div>
    </div>
  );
}