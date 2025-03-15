export interface Expense {
    id: number;
    date: Date;
    description: string;
    category: string;
    cost: number;
}

export interface Category {
    id: number;
    name: string;
}