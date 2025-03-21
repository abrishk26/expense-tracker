"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Expenses from "@/components/Expenses";
import Budget from "@/components/Budget";





export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "dashboard" && <Dashboard />}
      {activeSection === "expenses" && <Expenses />}
      {activeSection === "budget" && <Budget />}
    </Sidebar>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import Cookies from "js-cookie";

// interface Expense {
//   id: string; // uuid
//   created_at: string; // timestamptz
//   description: string; // text
//   date: string; // date
//   amount: number; // double precision
//   category: string; // text
//   user_id: string; // uuid (foreign key)
// }

// interface BudgetGoal {
//   id: string; // uuid
//   created_at: string; // timestamptz
//   user_id: string; // uuid (foreign key)
//   year: number; // bigint
//   month: number; // bigint
//   goal_amount: number; // bigint
// }

// export default function Dashboard() {
//   const router = useRouter();
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [budgetGoal, setBudgetGoal] = useState<BudgetGoal | null>(null);
//   const [totalSpending, setTotalSpending] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Form states
//   const [newExpense, setNewExpense] = useState({
//     date: "",
//     description: "",
//     amount: 0,
//     category: "Food",
//   });
//   const [newBudgetGoal, setNewBudgetGoal] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     goal_amount: 0,
//   });

//   // Fetch data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const sessionCookie = Cookies.get("supabase_session");
//         if (!sessionCookie) {
//           router.push("/");
//           return;
//         }

//         const sessionData = JSON.parse(sessionCookie);
//         const userId = sessionData.user.id;

//         // Fetch expenses for the current month
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth() + 1;

//         const { data: expensesData, error: expensesError } = await supabase
//           .from("expenses")
//           .select("*")
//           .eq("user_id", userId)
//           .gte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`)
//           .lte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-31`);

//         if (expensesError) throw new Error(expensesError.message);

//         setExpenses(expensesData || []);

//         // Fetch budget goal for the current month
//         const { data: budgetData, error: budgetError } = await supabase
//           .from("budget_goals")
//           .select("*")
//           .eq("user_id", userId)
//           .eq("year", currentYear)
//           .eq("month", currentMonth)
//           .single();

//         if (budgetError) {
//           if (budgetError.code === "PGRST116") {
//             setBudgetGoal(null); // No budget goal set
//           } else {
//             throw new Error(budgetError.message);
//           }
//         } else {
//           setBudgetGoal(budgetData);
//         }

//         // Calculate total spending for the current month
//         const total = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
//         setTotalSpending(total);
//       } catch (err: any) {
//         setError(err.message || "An error occurred while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle adding a new expense
//   const handleAddExpense = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const sessionCookie = Cookies.get("supabase_session");
//       if (!sessionCookie) {
//         router.push("/");
//         return;
//       }

//       const sessionData = JSON.parse(sessionCookie);
//       const userId = sessionData.user.id;

//       const { error } = await supabase.from("expenses").insert([
//         {
//           user_id: userId,
//           date: newExpense.date,
//           description: newExpense.description,
//           amount: newExpense.amount,
//           category: newExpense.category,
//         },
//       ]);

//       if (error) throw new Error(error.message);

//       // Refresh expenses list
//       const currentYear = new Date().getFullYear();
//       const currentMonth = new Date().getMonth() + 1;

//       const { data: expensesData, error: expensesError } = await supabase
//         .from("expenses")
//         .select("*")
//         .eq("user_id", userId)
//         .gte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`)
//         .lte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-31`);

//       if (expensesError) throw new Error(expensesError.message);

//       setExpenses(expensesData || []);
//       setTotalSpending((prev) => prev + newExpense.amount);

//       // Reset form
//       setNewExpense({
//         date: "",
//         description: "",
//         amount: 0,
//         category: "Food",
//       });
//     } catch (err: any) {
//       setError(err.message || "An error occurred while adding the expense.");
//     }
//   };

//   // Handle setting/updating budget goal
//   const handleSetBudgetGoal = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const sessionCookie = Cookies.get("supabase_session");
//       if (!sessionCookie) {
//         router.push("/");
//         return;
//       }

//       const sessionData = JSON.parse(sessionCookie);
//       const userId = sessionData.user.id;

//       const { error } = await supabase
//         .from("budget_goals")
//         .upsert([
//           {
//             user_id: userId,
//             year: newBudgetGoal.year,
//             month: newBudgetGoal.month,
//             goal_amount: newBudgetGoal.goal_amount,
//           },
//         ]);

//       if (error) throw new Error(error.message);

//       // Refresh budget goal
//       const { data: budgetData, error: budgetError } = await supabase
//         .from("budget_goals")
//         .select("*")
//         .eq("user_id", userId)
//         .eq("year", newBudgetGoal.year)
//         .eq("month", newBudgetGoal.month)
//         .single();

//       if (budgetError) throw new Error(budgetError.message);

//       setBudgetGoal(budgetData);
//       setNewBudgetGoal({
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         goal_amount: 0,
//       });
//     } catch (err: any) {
//       setError(err.message || "An error occurred while setting the budget goal.");
//     }
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     Cookies.remove("supabase_session");
//     router.push("/");
//   };

//   // If the user is not authenticated, this component won't render
//   return (
//     <div className="min-h-screen flex flex-col bg-blue-50">
//       {/* Navbar */}
//       <nav className="bg-blue-600 text-white p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <Link href="/" className="text-xl font-bold">
//             Expense Tracker
//           </Link>
//           <button onClick={handleLogout} className="hover:text-blue-200">
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Dashboard Content */}
//       <div className="container mx-auto p-8">
//         <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

//         {/* Error Message */}
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {/* Loading State */}
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : (
//           <div className="space-y-8">
//             {/* Recent Expenses Table */}
//             <div>
//               <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white rounded-lg shadow-md border-collapse">
//                   <thead>
//                     <tr className="bg-blue-600 text-white">
//                       <th className="px-4 py-2 border border-gray-300">Date</th>
//                       <th className="px-4 py-2 border border-gray-300">Description</th>
//                       <th className="px-4 py-2 border border-gray-300">Amount</th>
//                       <th className="px-4 py-2 border border-gray-300">Category</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {expenses.length > 0 ? (
//                       expenses.map((expense) => (
//                         <tr key={expense.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 border border-gray-300">{expense.date}</td>
//                           <td className="px-4 py-2 border border-gray-300">{expense.description}</td>
//                           <td className="px-4 py-2 border border-gray-300">${expense.amount.toFixed(2)}</td>
//                           <td className="px-4 py-2 border border-gray-300">{expense.category}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={4} className="px-4 py-2 text-center text-gray-500 border border-gray-300">
//                           No expenses recorded yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Budget Summary Table */}
//             <div>
//               <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white rounded-lg shadow-md border-collapse">
//                   <thead>
//                     <tr className="bg-blue-600 text-white">
//                       <th className="px-4 py-2 border border-gray-300">Year</th>
//                       <th className="px-4 py-2 border border-gray-300">Month</th>
//                       <th className="px-4 py-2 border border-gray-300">Budget Goal</th>
//                       <th className="px-4 py-2 border border-gray-300">Total Spending</th>
//                       <th className="px-4 py-2 border border-gray-300">Remaining Budget</th>
//                       <th className="px-4 py-2 border border-gray-300">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {budgetGoal !== null ? (
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-4 py-2 border border-gray-300">{budgetGoal.year}</td>
//                         <td className="px-4 py-2 border border-gray-300">{budgetGoal.month}</td>
//                         <td className="px-4 py-2 border border-gray-300">${budgetGoal.goal_amount.toFixed(2)}</td>
//                         <td className="px-4 py-2 border border-gray-300">${totalSpending.toFixed(2)}</td>
//                         <td className="px-4 py-2 border border-gray-300">${(budgetGoal.goal_amount - totalSpending).toFixed(2)}</td>
//                         <td className="px-4 py-2 border border-gray-300">
//                           {totalSpending > budgetGoal.goal_amount ? (
//                             <span className="text-red-500">Over Budget</span>
//                           ) : (
//                             <span className="text-green-500">Within Budget</span>
//                           )}
//                         </td>
//                       </tr>
//                     ) : (
//                       <tr>
//                         <td colSpan={6} className="px-4 py-2 text-center text-gray-500 border border-gray-300">
//                           No budget goal set yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Add Expense Form */}
//             <div>
//               <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
//               <form onSubmit={handleAddExpense} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date</label>
//                   <input
//                     type="date"
//                     value={newExpense.date}
//                     onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <input
//                     type="text"
//                     value={newExpense.description}
//                     onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Amount</label>
//                   <input
//                     type="number"
//                     value={newExpense.amount}
//                     onChange={(e) => {
//                       const value = parseFloat(e.target.value);
//                       setNewExpense({ ...newExpense, amount: isNaN(value) ? 0 : value });
//                     }}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Category</label>
//                   <select
//                     value={newExpense.category}
//                     onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   >
//                     <option value="Food">Food</option>
//                     <option value="Transport">Transport</option>
//                     <option value="Entertainment">Entertainment</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Add Expense
//                 </button>
//               </form>
//             </div>

//             {/* Set Budget Goal Form */}
//             <div>
//               <h2 className="text-2xl font-bold mb-4">Set Budget Goal</h2>
//               <form onSubmit={handleSetBudgetGoal} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Year</label>
//                   <input
//                     type="number"
//                     value={newBudgetGoal.year}
//                     onChange={(e) => setNewBudgetGoal({ ...newBudgetGoal, year: parseInt(e.target.value) })}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Month</label>
//                   <input
//                     type="number"
//                     value={newBudgetGoal.month}
//                     onChange={(e) => setNewBudgetGoal({ ...newBudgetGoal, month: parseInt(e.target.value) })}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Goal Amount</label>
//                   <input
//                     type="number"
//                     value={newBudgetGoal.goal_amount}
//                     onChange={(e) => {
//                       const value = parseFloat(e.target.value);
//                       setNewBudgetGoal({ ...newBudgetGoal, goal_amount: isNaN(value) ? 0 : value });
//                     }}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Set Budget Goal
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }