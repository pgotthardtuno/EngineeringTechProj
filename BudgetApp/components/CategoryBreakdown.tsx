"use client"
import {useEffect, useState} from "react";
import { Expense } from "@/types";

interface CategoryBreakdownProps {
    selectedMonth: string;
}
const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({selectedMonth}) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [monthlyCategoryTotals, setMonthlyCategoryTotals] = useState<{ [month: string]: { [category: string]: number } }>({});
    const [monthlyTotalExpenses, setMonthlyTotalExpenses] = useState<{ [month: string]: number }>({});

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await fetch('/api/expenses');
            const data: Expense[] = await response.json();
            setExpenses(data);
        };
        fetchExpenses();
    }, []);

    useEffect(() => {
        const monthlyTotals: { [month: string]: { [category: string]: number } } = {};
        const monthlyExpenses: { [month: string]: number } = {};

        expenses.forEach(expense => {
            const monthIndex = new Date(expense.date).getMonth();
            const monthName = monthNames[monthIndex];

            if (!monthlyTotals[monthName]) {
                monthlyTotals[monthName] = {};
                monthlyExpenses[monthName] = 0;
            }
            if (!monthlyTotals[monthName][expense.category]) {
                monthlyTotals[monthName][expense.category] = 0;
            }
            monthlyTotals[monthName][expense.category] += expense.cost;
            monthlyExpenses[monthName] += expense.cost;
        });
        setMonthlyCategoryTotals(monthlyTotals);
        setMonthlyTotalExpenses(monthlyExpenses);
    }, [expenses]);

    const displayMonthlyBreakdown = (month: string) => {
        const monthlyTotal = monthlyTotalExpenses[month] || 0;
        const categories = monthlyCategoryTotals[month] || {};
        return (
            <div className="monthly-breakdown" key={month}>
                <h4 className="monthly-breakdown-header">{month}</h4>
                <ul>
                    {Object.entries(categories).map(([category, total]) => (
                        <li key={category}>
                            {category}: {monthlyTotal > 0 && month === selectedMonth ? ((total / monthlyTotal) * 100).toFixed(2) : '0.00'}%
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="category-breakdowns">
            <h3 className="category-breakdowns-header">Monthly Category Breakdowns</h3>
            <div className="monthly-breakdowns-container">
                {monthNames.map(month => displayMonthlyBreakdown(month))}
            </div>
        </div>
    );
};

export default CategoryBreakdown;