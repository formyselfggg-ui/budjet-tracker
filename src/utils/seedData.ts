import { Category, Transaction, BudgetMap } from '../types';
import { getCurrentMonthKey } from './formatters';

export const DEFAULT_CATEGORIES: Category[] = [
	{ id: 'cat-1', name: 'Food', color: '#F97316', isDefault: true },
	{ id: 'cat-2', name: 'Transport', color: '#3B82F6', isDefault: true },
	{ id: 'cat-3', name: 'Bills', color: '#EF4444', isDefault: true },
	{ id: 'cat-4', name: 'Rent', color: '#8B5CF6', isDefault: true },
	{ id: 'cat-5', name: 'Shopping', color: '#EC4899', isDefault: true },
	{ id: 'cat-6', name: 'Health', color: '#10B981', isDefault: true },
	{ id: 'cat-7', name: 'Entertainment', color: '#F59E0B', isDefault: true },
	{ id: 'cat-8', name: 'Savings', color: '#06B6D4', isDefault: true },
	{ id: 'cat-9', name: 'Other', color: '#64748B', isDefault: true },
];

export const DEFAULT_BUDGETS: BudgetMap = {
	Food: 12000,
	Transport: 5000,
	Bills: 7000,
	Rent: 15000,
	Shopping: 4000,
	Health: 3000,
	Entertainment: 3500,
	Savings: 10000,
	Other: 2500,
};

export const getInitialTransactions = (): Transaction[] => {
	const currentMonthKey = getCurrentMonthKey();
	const [yearStr, monthStr] = currentMonthKey.split('-');
	const year = parseInt(yearStr, 10);
	const month = parseInt(monthStr, 10);

	const pad = (n: number) => String(n).padStart(2, '0');
	const makeDate = (offsetMonth: number, day: number) => {
		const d = new Date(year, month - 1 - offsetMonth, day);
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	};

	return [
		{
			id: 'tx-1',
			type: 'income',
			amount: 48000,
			category: 'Other',
			date: makeDate(0, 5),
			note: 'Primary Monthly Salary',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-2',
			type: 'income',
			amount: 9500,
			category: 'Other',
			date: makeDate(0, 16),
			note: 'Freelance Design Retainer',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-3',
			type: 'expense',
			amount: 15000,
			category: 'Rent',
			date: makeDate(0, 2),
			note: 'Monthly condo unit rent',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-4',
			type: 'expense',
			amount: 10200,
			category: 'Food',
			date: makeDate(0, 8),
			note: 'Bulk groceries & fresh produce (near 85% limit)',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-5',
			type: 'expense',
			amount: 5400,
			category: 'Transport',
			date: makeDate(0, 12),
			note: 'Fuel and tollway reload (exceeded limit!)',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-6',
			type: 'expense',
			amount: 5800,
			category: 'Bills',
			date: makeDate(0, 14),
			note: 'Electricity and fiber internet',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-7',
			type: 'expense',
			amount: 2100,
			category: 'Entertainment',
			date: makeDate(0, 18),
			note: 'Cinema tickets and dining out',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-8',
			type: 'income',
			amount: 48000,
			category: 'Other',
			date: makeDate(1, 5),
			note: 'Salary',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-9',
			type: 'expense',
			amount: 32000,
			category: 'Bills',
			date: makeDate(1, 10),
			note: 'Living costs',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-10',
			type: 'income',
			amount: 50000,
			category: 'Other',
			date: makeDate(2, 5),
			note: 'Salary + bonus',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-11',
			type: 'expense',
			amount: 36000,
			category: 'Shopping',
			date: makeDate(2, 12),
			note: 'Quarterly shopping and supplies',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-12',
			type: 'income',
			amount: 48000,
			category: 'Other',
			date: makeDate(3, 5),
			note: 'Salary',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-13',
			type: 'expense',
			amount: 31000,
			category: 'Rent',
			date: makeDate(3, 15),
			note: 'Monthly basics',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-14',
			type: 'income',
			amount: 48000,
			category: 'Other',
			date: makeDate(4, 5),
			note: 'Salary',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-15',
			type: 'expense',
			amount: 29500,
			category: 'Food',
			date: makeDate(4, 18),
			note: 'Food & general expenses',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-16',
			type: 'income',
			amount: 47000,
			category: 'Other',
			date: makeDate(5, 5),
			note: 'Salary',
			createdAt: new Date().toISOString(),
		},
		{
			id: 'tx-17',
			type: 'expense',
			amount: 28000,
			category: 'Bills',
			date: makeDate(5, 20),
			note: 'Monthly expenses',
			createdAt: new Date().toISOString(),
		},
	];
};
