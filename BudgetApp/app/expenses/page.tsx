"use client"
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import Budget from "@/components/Budget";
import {useState, useEffect} from "react";
import {Expense} from "@/types";

const ExpensesPage = () => {
    const [expenseAdded, setExpenseAdded] = useState<number>(0);
    const [expenseDeleted, setExpenseDeleted] = useState<number>(0);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const [selectedMonth, setSelectedMonth] = useState<string>(monthNames[new Date().getMonth()]);

    const handleExpenseAdded = () => {
        setExpenseAdded(prev => prev + 1);
    };

    const handleExpenseDeleted = () => {
        setExpenseDeleted(prev => prev + 1);
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await fetch('/api/expenses');
            const data: Expense[] = await response.json();
            setExpenses(data);
        };
        fetchExpenses();
    }, []);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div className="expenses-page">
            <div className="category-container">
                <CategoryBreakdown selectedMonth={selectedMonth}/>
            </div>
            <div className="main-content">
                <h1 className="header">Expenses</h1>
                <div className="form-container">
                    <ExpenseForm onExpenseAdded={handleExpenseAdded}/>
                </div>
                <div className="table-container">
                    <ExpenseList expenseAdded={expenseAdded} expenseDeleted={expenseDeleted} onExpenseDeleted={handleExpenseDeleted} onExpenseAdded={handleExpenseAdded} selectedMonth={selectedMonth}/>
                </div>
            </div>
            <div className="budget-container">
                <div className="month-select-container">
                    <label htmlFor="month-select">Select Month:</label>
                    <select id="month-select" value={selectedMonth} onChange={handleMonthChange} className="month-select">
                        {monthNames.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <Budget expenses={expenses} selectedMonth={selectedMonth}/>
            </div>
        </div>
    );
};

export default ExpensesPage;