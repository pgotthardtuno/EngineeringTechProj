"use client"
import { useState } from 'react';
import categories from '../data/categories';
import { Category, Expense } from '../types';

interface ExpenseFormProps {
    onExpenseAdded: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({onExpenseAdded}) => {
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [cost, setCost] = useState<number>(0);
    const [category, setCategory] = useState<string>(categories[0].name);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newExpense: Expense = {
            id: 0, //Will be assigned by the DB
            description,
            date,
            cost,
            category,
        };
        await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExpense),
        });
        await onExpenseAdded();
        setDescription('');
        setDate(new Date());
        setCost(0);
        setCategory(categories[0].name);
    };
    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value)) || value === "") {
            setCost(value === "" ? 0 : Number(value));
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="description" className="form-label">Description</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" />
            </div>
            <div>
                <label htmlFor="date" className="form-label">Date</label>
                <input type="date" id="date" value={date.toISOString().split('T')[0]} onChange={(e) => setDate(new Date(e.target.value))} className="form-input" required />
            </div>
            <div>
                <label htmlFor="cost" className="form-label">Cost</label>
                <input type="text" id="cost" value={cost} onChange={handleCostChange} className="form-input" required pattern="^\d*(\.\d+)?$" />
            </div>
            <div>
                <label htmlFor="category" className="form-label">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="form-select" required>
                    {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="form-button">Add Expense</button>
        </form>
    );
};

export default ExpenseForm;