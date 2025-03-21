import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "@/lib/supabaseClient";
import { FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface BudgetGoal {
  id: string;
  year: number;
  month: number;
  goal_amount: number;
  category: string;
  remaining_amount: number;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export default function Budget() {
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBudgetGoal, setNewBudgetGoal] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    goal_amount: 0,
    category: "Food",
  });
  const [editingBudgetGoal, setEditingBudgetGoal] = useState<BudgetGoal | null>(null);
  const [error, setError] = useState("");

  // Fetch budget goals
  const fetchBudgetGoals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("budget_goals")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error(error);
      setError("Failed to load budget goals.");
    } else {
      // Calculate remaining amount for each budget goal
      const goalsWithRemainingAmount = await Promise.all(
        (data || []).map(async (goal: BudgetGoal) => {
          const totalExpense = await calculateTotalExpenses(goal.year, goal.month, goal.category);
          const remainingAmount = goal.goal_amount - totalExpense;
          return { ...goal, remaining_amount: remainingAmount };
        })
      );
      setBudgetGoals(goalsWithRemainingAmount);
    }
    setLoading(false);
  };

  // Calculate total expenses for a given category, year, and month
  const calculateTotalExpenses = async (year: number, month: number, category: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("amount")
      .eq("category", category)
      .gte("date", `${year}-${String(month).padStart(2, "0")}-01`) // Start of the month
      .lt("date", `${year}-${String(month).padStart(2, "0")}-31`); // Start of the next month
  
    if (error) {
      console.error("Error fetching expenses:", error);
      return 0;
    }
  
    return (data || []).reduce((total, expense) => total + expense.amount, 0);
  };

  // Fetch budget goals on component mount
  useEffect(() => {
    fetchBudgetGoals();
  }, []);

  const validateDate = (year: number, month: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError("Cannot set a budget for a past month or year.");
      return false;
    }
    return true;
  };

  const handleSetBudgetGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const sessionCookie = Cookies.get("supabase_session");
      if (!sessionCookie) {
        throw new Error("No session found. Please log in.");
      }

      let sessionData;
      try {
        sessionData = JSON.parse(sessionCookie);
      } catch (parseError) {
        throw new Error("Invalid session data.");
      }

      const userId = sessionData.user?.id;
      if (!userId) {
        throw new Error("User ID not found in session.");
      }

      const isValid = validateDate(newBudgetGoal.year, newBudgetGoal.month);
      if (!isValid) return;

      // Check if a budget goal already exists for the same category, year, and month
      const { data: existingGoals, error: fetchError } = await supabase
        .from("budget_goals")
        .select("id")
        .eq("user_id", userId)
        .eq("category", newBudgetGoal.category)
        .eq("year", newBudgetGoal.year)
        .eq("month", newBudgetGoal.month);

      if (fetchError) {
        throw new Error("Error checking for existing budget goals.");
      }

      if (existingGoals && existingGoals.length > 0) {
        setError("A budget goal already exists for this category, year, and month.");
        return;
      }

      const { error } = await supabase
        .from("budget_goals")
        .upsert([
          {
            user_id: userId,
            year: newBudgetGoal.year,
            month: newBudgetGoal.month,
            goal_amount: newBudgetGoal.goal_amount,
            category: newBudgetGoal.category,
          },
        ]);

      if (error) {
        throw new Error(error.message);
      }

      setNewBudgetGoal({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        goal_amount: 0,
        category: "Food",
      });
      setError(""); // Clear any previous errors
      await fetchBudgetGoals();
      alert("Budget goal saved successfully!");
    } catch (error) {
      console.error("Error setting budget goal:", error);
      if (error instanceof Error) {
        setError(error.message || "An error occurred while saving the budget goal.");
      } else {
        setError("An error occurred while saving the budget goal.");
      }
    }
  };

  const handleEditBudgetGoal = (goal: BudgetGoal) => {
    setEditingBudgetGoal(goal);
    setNewBudgetGoal({
      year: goal.year,
      month: goal.month,
      goal_amount: goal.goal_amount,
      category: goal.category,
    });
  };

  const handleDeleteBudgetGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget goal?")) return;

    const { error } = await supabase.from("budget_goals").delete().eq("id", id);
    if (error) {
      setError("Failed to delete budget goal.");
      console.error(error);
    } else {
      setBudgetGoals(budgetGoals.filter((goal) => goal.id !== id));
    }
  };

  // Helper function to determine the icon and color based on remaining amount
  const getRemainingAmountStatus = (remainingAmount: number) => {
    if (remainingAmount >= 0) {
      return { icon: <FaCheckCircle className="text-green-500" />, color: "text-green-500" };
    } else {
      return { icon: <FaExclamationCircle className="text-red-500" />, color: "text-red-500" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Budget</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Budget Goal Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSetBudgetGoal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Year"
              value={newBudgetGoal.year}
              onChange={(e) =>
                setNewBudgetGoal({
                  ...newBudgetGoal,
                  year: parseInt(e.target.value) || new Date().getFullYear(),
                })
              }
              required
              className="border px-3 py-2 rounded w-full"
            />
            <select
              value={newBudgetGoal.month}
              onChange={(e) => setNewBudgetGoal({ ...newBudgetGoal, month: parseInt(e.target.value) })}
              className="border px-3 py-2 rounded w-full"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Goal Amount"
              value={newBudgetGoal.goal_amount}
              onChange={(e) =>
                setNewBudgetGoal({
                  ...newBudgetGoal,
                  goal_amount: parseFloat(e.target.value) || 0,
                })
              }
              required
              className="border px-3 py-2 rounded w-full"
            />
            <select
              value={newBudgetGoal.category}
              onChange={(e) => setNewBudgetGoal({ ...newBudgetGoal, category: e.target.value })}
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
            {editingBudgetGoal ? "Update Budget Goal" : "Add Budget Goal"}
          </button>
        </form>
      </div>

      {/* Budget Goals List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Recent Budget Goals</h2>
        {loading ? (
          <p className="text-gray-500">Loading budget goals...</p>
        ) : budgetGoals.length === 0 ? (
          <p className="text-gray-500">No budget goals set yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetGoals.map((goal) => (
              <div key={goal.id} className="border p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {new Date(0, goal.month - 1).toLocaleString("default", { month: "long" })} {goal.year}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditBudgetGoal(goal)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <FaEdit className="inline-block mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBudgetGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <FaTrash className="inline-block mr-1" /> Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">Category: {goal.category}</p>
                <p className="text-gray-600">Goal Amount: ${goal.goal_amount.toFixed(2)}</p>
                <p className={`text-gray-600 ${getRemainingAmountStatus(goal.remaining_amount).color}`}>
                  {getRemainingAmountStatus(goal.remaining_amount).icon} Remaining Amount: ${goal.remaining_amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
