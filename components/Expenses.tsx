"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format, parseISO, endOfMonth } from "date-fns";
import { FaEdit, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie"; // Import js-cookie

interface Expense {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    user_id: string; // Add user_id to the Expense interface
}

export default function Expenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [newExpense, setNewExpense] = useState({
        date: "",
        description: "",
        amount: 0,
        category: "Food",
    });
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [error, setError] = useState("");

    // Fetch expenses on component mount
    useEffect(() => {
        const fetchExpenses = async () => {
            const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false });
            if (error) {
                console.error(error);
                setError("Failed to load expenses.");
            } else {
                setExpenses(data || []);
            }
            setLoading(false);
        };
        fetchExpenses();
    }, []);

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

    const checkBudgetExists = async (month: number, year: number, category: string) => {
        console.log(`Checking budget for month: ${month}, year: ${year}`); // Debug log
        const { data, error } = await supabase
            .from("budget_goals")
            .select("goal_amount")
            .eq("year", year)
            .eq("month", month)
            .eq("category", category);

        if (error || !data || data.length === 0) {
            console.error("Budget fetch error:", error); // Debug log
            setError("No budget set for this month.");
            return false;
        }
        if (data.length > 1) {
            console.warn("Multiple budget entries found, using the first one."); // Debug log
        }
        console.log("Budget data:", data[0]); // Debug log
        return true;
    };

    const checkBudgetLimit = async (month: number, year: number, newAmount: number, category: string) => {
        console.log(`Checking budget limit for month: ${month}, year: ${year}, newAmount: ${newAmount}`); // Debug log
        const { data: budgetData, error: budgetError } = await supabase
            .from("budget_goals")
            .select("goal_amount")
            .eq("year", year)
            .eq("month", month)
            .eq("category", category);

        if (budgetError || !budgetData || budgetData.length === 0) {
            console.error("Budget fetch error:", budgetError); // Debug log
            return false;
        }
        if (budgetData.length > 1) {
            console.warn("Multiple budget entries found, using the first one."); // Debug log
        }

        const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
        const endDate = format(endOfMonth(new Date(year, month - 1)), "yyyy-MM-dd");

        console.log(`Fetching expenses between ${startDate} and ${endDate}`); // Debug log
        const { data: totalExpenses, error: expensesError } = await supabase
            .from("expenses")
            .select("amount")
            .gte("date", startDate)
            .lte("date", endDate);

        if (expensesError) {
            console.error("Expenses fetch error:", expensesError); // Debug log
            return false;
        }

        const currentTotal = totalExpenses ? totalExpenses.reduce((sum, exp) => sum + exp.amount, 0) : 0;
        console.log(`Current total expenses: ${currentTotal}, Budget amount: ${budgetData[0].goal_amount}`); // Debug log
        return budgetData[0].goal_amount >= currentTotal + newAmount;
    };

    const handleSubmitExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Reset error before submitting

        try {
            // Extract user_id from the session cookie
            const userId = getUserIdFromSession();
            if (!userId) {
                setError("User is not authenticated.");
                return;
            }

            const expenseDate = new Date(newExpense.date);
            const expenseMonth = expenseDate.getMonth() + 1; // Month is 1-based (1 = January)
            const expenseYear = expenseDate.getFullYear();

            console.log("Expense month:", expenseMonth); // Debug log
            console.log("Expense year:", expenseYear); // Debug log

            // Check if a budget exists for the specified month
            const budgetExists = await checkBudgetExists(expenseMonth, expenseYear, newExpense.category);
            if (!budgetExists) return;

            // Check if the expense exceeds the budget
            const isValid = await checkBudgetLimit(expenseMonth, expenseYear, newExpense.amount, newExpense.category);
            if (!isValid) {
                setError("Warning: This expense exceeds the budget for this month, but it will be added.");
            }

            if (editingExpense) {
                // Update existing expense
                const { data, error } = await supabase
                    .from("expenses")
                    .update({ ...newExpense, user_id: userId })
                    .eq("id", editingExpense.id)
                    .select();

                if (error) {
                    setError("Failed to update expense.");
                    console.error(error);
                } else if (data) {
                    setExpenses(expenses.map((exp) => (exp.id === editingExpense.id ? data[0] : exp)));
                    setEditingExpense(null);
                }
            } else {
                // Add new expense
                const { data, error } = await supabase
                    .from("expenses")
                    .insert([{ ...newExpense, user_id: userId }])
                    .select();

                if (error) {
                    setError("Failed to add expense.");
                    console.error(error);
                } else if (data) {
                    setExpenses([data[0], ...expenses]);
                }
            }

            // Reset form
            setNewExpense({ date: "", description: "", amount: 0, category: "Food" });
        } catch (error) {
            console.error("Error setting expense:", error);
            if (error instanceof Error) {
                setError(error.message || "An error occurred while saving the expense.");
            } else {
                setError("An error occurred while saving the expense.");
            }
        }
    };


    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setNewExpense({
            date: expense.date,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
        });
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense?")) return;

        const { error } = await supabase.from("expenses").delete().eq("id", id);
        if (error) {
            setError("Failed to delete expense.");
            console.error(error);
        } else {
            setExpenses(expenses.filter((expense) => expense.id !== id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Expenses</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Expense Form */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSubmitExpense} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            required
                            className="border px-3 py-2 rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            required
                            className="border px-3 py-2 rounded w-full"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                            required
                            className="border px-3 py-2 rounded w-full"
                        />
                        <select
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        {editingExpense ? "Update Expense" : "Add Expense"}
                    </button>
                </form>
            </div>

            {/* Expenses List */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Recent Expenses</h2>
                {loading ? (
                    <p className="text-gray-500">Loading expenses...</p>
                ) : expenses.length === 0 ? (
                    <p className="text-gray-500">No expenses recorded yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {expenses.map((expense) => (
                            <div key={expense.id} className="border p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold">
                                        {format(parseISO(expense.date), "yyyy-MM-dd")}
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditExpense(expense)}
                                            className="text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <FaEdit className="inline-block mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="text-red-500 hover:text-red-700 flex items-center"
                                        >
                                            <FaTrash className="inline-block mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600">Description: {expense.description}</p>
                                <p className="text-gray-600">Amount: ${expense.amount.toFixed(2)}</p>
                                <p className="text-gray-600">Category: {expense.category}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}