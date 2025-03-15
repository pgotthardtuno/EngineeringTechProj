"use client"
import { useState, useEffect } from 'react';
import categories from "@/data/categories";
import {Expense} from "@/types";

interface BudgetTrackerProps {
    expenses: Expense[];
    selectedMonth: string;
}

const Budget: React.FC<BudgetTrackerProps> = ({expenses, selectedMonth}) => {
    const [budgets, setBudgets] = useState<{ [month: string]: { [category: string]: number } }>({});
    const [monthlyCategoryTotals, setMonthlyCategoryTotals] = useState<{ [category: string]: number }>({});
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const storedBudgets = localStorage.getItem('budgets');
        if (storedBudgets) {
            setBudgets(JSON.parse(storedBudgets));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('budgets', JSON.stringify(budgets));
    }, [budgets]);

    useEffect(() => {
        const totals: { [category: string]: number } = {};
        expenses.forEach(expense => {
            const monthIndex = new Date(expense.date).getMonth();
            const monthName = monthNames[monthIndex];
            if (monthName !== selectedMonth) return;
            if (!totals[expense.category]) {
                totals[expense.category] = 0;
            }
            totals[expense.category] += expense.cost;
        });
        setMonthlyCategoryTotals(totals);
    }, [expenses, selectedMonth]);

    const handleBudgetChange = (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setBudgets(prev => ({
            ...prev,
            [selectedMonth]: {
                ...prev[selectedMonth],
                [category]: value
            }
        }));
    };
    return (
        <div className="budget-tracker">
            <h3 className="budget-tracker-header">Monthly Budget</h3>
            {categories.map((category) => (
                <div key={category.name} className="budget-item">
                    <label htmlFor={category.name} className="budget-label">{category.name}</label>
                    <input
                        type="number"
                        id={category.name}
                        className="budget-input"
                        value={budgets[selectedMonth]?.[category.name] || ''}
                        onChange={(e) => handleBudgetChange(category.name, e)}
                    />
                    <p className="budget-used">
                        Used: ${monthlyCategoryTotals[category.name]?.toFixed(2) || '0.00'}
                    </p>
                    {budgets[selectedMonth]?.[category.name] && (
                        <p className={`budget-status ${monthlyCategoryTotals[category.name] > budgets[selectedMonth][category.name] ? 'over-budget' : 'under-budget'}`}>
                            {monthlyCategoryTotals[category.name] > budgets[selectedMonth][category.name] ? 'Over Budget' : 'Under Budget'}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Budget;