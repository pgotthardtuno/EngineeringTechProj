import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Expense } from "@/types";
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body: Expense = await req.json();
        const newExpense = await prisma.expense.create({
            data: {
                description: body.description,
                date: new Date(body.date),
                cost: body.cost,
                category: body.category,
            },
        });
        return NextResponse.json(newExpense, { status: 201 });
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany();
        return NextResponse.json(expenses, { status: 200 });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const id = parseInt(searchParams.get('id') || "");

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.expense.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }
}