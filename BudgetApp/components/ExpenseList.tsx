"use client"
import {useEffect, useState} from "react";
import {Expense} from "@/types";

interface ExpenseListProps {
    expenseAdded: number;
    expenseDeleted: number;
    onExpenseDeleted: () => void;
    onExpenseAdded:() => void;
    selectedMonth: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({expenseAdded, expenseDeleted, onExpenseDeleted, onExpenseAdded, selectedMonth}) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await fetch('/api/expenses');
            const data: Expense[] = await response.json();
            const filteredExpenses = data.filter((expense) => {
                const monthIndex = new Date(expense.date).getMonth();
                const monthName = monthNames[monthIndex];
                return monthName === selectedMonth;
            });
            setExpenses(filteredExpenses);
        };
        fetchExpenses();
    }, [expenseAdded, expenseDeleted, selectedMonth]);

    const handleDelete = async (id: number) => {
        await fetch(`/api/expenses?id=${id}`, {
            method: 'DELETE',
        });
        onExpenseDeleted();
    }

    return (
        <table className="expense-table">
            <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {expenses.map(expense => (
                <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>${expense.cost.toFixed(2)}</td>
                    <td>
                        <button onClick={() => handleDelete(expense.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ExpenseList;