import { Expense } from "../types";

export const getExpenses = async (): Promise<Expense[]> => {
    const response = await fetch('/api/expenses');
    const data: Expense[] = await response.json();
    return data;
};