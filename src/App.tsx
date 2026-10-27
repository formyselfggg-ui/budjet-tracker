import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { DashboardCharts } from './components/DashboardCharts';
import { BudgetProgress } from './components/BudgetProgress';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { CategoryModal } from './components/CategoryModal';
import { ConfirmModal } from './components/ConfirmModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_CATEGORIES, DEFAULT_BUDGETS, getInitialTransactions } from './utils/seedData';
import { getCurrentMonthKey } from './utils/formatters';
import { exportTransactionsToCSV } from './utils/csv';
import { Transaction, Category, BudgetMap } from './types';

export const App: React.FC = () => {
	const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
		'bt_transactions_v1',
		getInitialTransactions()
	);
	const [categories, setCategories] = useLocalStorage<Category[]>(
		'bt_categories_v1',
		DEFAULT_CATEGORIES
	);
	const [budgets, setBudgets] = useLocalStorage<BudgetMap>(
		'bt_budgets_v1',
		DEFAULT_BUDGETS
	);
	const [balanceAdjustments, setBalanceAdjustments] = useLocalStorage<Record<string, number>>(
		'bt_balance_adjustments_v1',
		{}
	);
	const [currency, setCurrency] = useLocalStorage<string>('bt_currency_v1', '₱');
	const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('bt_theme_v1', 'light');

	const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthKey());
	const [isTxModalOpen, setIsTxModalOpen] = useState(false);
	const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
	const [isCatModalOpen, setIsCatModalOpen] = useState(false);

	const [confirmState, setConfirmState] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [theme]);

	const handleToggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	const currentMonthTransactions = transactions.filter((t) =>
		t.date.startsWith(selectedMonth)
	);

	const totalIncome = currentMonthTransactions
		.filter((t) => t.type === 'income')
		.reduce((sum, t) => sum + t.amount, 0);

	const totalExpenses = currentMonthTransactions
		.filter((t) => t.type === 'expense')
		.reduce((sum, t) => sum + t.amount, 0);
	const currentBalance = totalIncome - totalExpenses + (balanceAdjustments[selectedMonth] || 0);

	const handleUpdateBalance = (updatedBalance: number) => {
		setBalanceAdjustments((prev) => {
			const next = { ...prev };
			const adjustment = updatedBalance - (totalIncome - totalExpenses);
			if (adjustment === 0) {
				delete next[selectedMonth];
			} else {
				next[selectedMonth] = adjustment;
			}
			return next;
		});
	};

	const handleSaveTransaction = (
		txData: Omit<Transaction, 'id' | 'createdAt'>,
		id?: string
	) => {
		if (id) {
			setTransactions((prev) =>
				prev.map((t) => (t.id === id ? { ...t, ...txData } : t))
			);
		} else {
			const newRecord: Transaction = {
				...txData,
				id: `tx-${Date.now()}`,
				createdAt: new Date().toISOString(),
			};
			setTransactions((prev) => [newRecord, ...prev]);
		}
	};

	const handleDeleteTransaction = (id: string) => {
		setConfirmState({
			isOpen: true,
			title: 'Delete Transaction',
			message: 'Are you sure you want to permanently delete this transaction?',
			onConfirm: () => {
				setTransactions((prev) => prev.filter((t) => t.id !== id));
				setConfirmState((prev) => ({ ...prev, isOpen: false }));
			},
		});
	};

	const handleUpdateBudget = (categoryName: string, limit: number) => {
		setBudgets((prev) => ({
			...prev,
			[categoryName]: limit,
		}));
	};

	const handleAddCategory = (name: string, color: string) => {
		const newCat: Category = {
			id: `cat-${Date.now()}`,
			name,
			color,
			isDefault: false,
		};
		setCategories((prev) => [...prev, newCat]);
	};

	const handleRenameCategory = (id: string, newName: string) => {
		const target = categories.find((c) => c.id === id);
		if (!target) return;
		const oldName = target.name;

		setCategories((prev) =>
			prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
		);
		setTransactions((prev) =>
			prev.map((t) => (t.category === oldName ? { ...t, category: newName } : t))
		);
		setBudgets((prev) => {
			const nextBudgets = { ...prev };
			if (nextBudgets[oldName] !== undefined) {
				nextBudgets[newName] = nextBudgets[oldName];
				delete nextBudgets[oldName];
			}
			return nextBudgets;
		});
	};

	const handleDeleteCategory = (id: string, name: string) => {
		setConfirmState({
			isOpen: true,
			title: `Delete "${name}" Category`,
			message:
				'Existing transactions under this category will remain, but the category will be removed from future selection options.',
			onConfirm: () => {
				setCategories((prev) => prev.filter((c) => c.id !== id));
				setConfirmState((prev) => ({ ...prev, isOpen: false }));
			},
		});
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
			<Navbar
				selectedMonth={selectedMonth}
				onMonthChange={setSelectedMonth}
				theme={theme}
				onToggleTheme={handleToggleTheme}
				currency={currency}
				onCurrencyChange={setCurrency}
				onOpenAddModal={() => {
					setEditingTransaction(null);
					setIsTxModalOpen(true);
				}}
				onOpenCategoryModal={() => setIsCatModalOpen(true)}
				onExportCSV={() => exportTransactionsToCSV(transactions, currency)}
			/>

			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
				<SummaryCards
					income={totalIncome}
					expenses={totalExpenses}
					balance={currentBalance}
					currency={currency}
					onUpdateBalance={handleUpdateBalance}
				/>

				<DashboardCharts
					currentMonthTransactions={currentMonthTransactions}
					allTransactions={transactions}
					categories={categories}
					currency={currency}
					selectedMonth={selectedMonth}
				/>

				<BudgetProgress
					categories={categories}
					currentMonthTransactions={currentMonthTransactions}
					budgets={budgets}
					onUpdateBudget={handleUpdateBudget}
					currency={currency}
				/>

				<TransactionList
					transactions={currentMonthTransactions}
					categories={categories}
					currency={currency}
					onEdit={(tx) => {
						setEditingTransaction(tx);
						setIsTxModalOpen(true);
					}}
					onDelete={handleDeleteTransaction}
				/>
			</main>

			<TransactionModal
				isOpen={isTxModalOpen}
				onClose={() => setIsTxModalOpen(false)}
				onSave={handleSaveTransaction}
				categories={categories}
				editingTransaction={editingTransaction}
				defaultMonth={selectedMonth}
			/>

			<CategoryModal
				isOpen={isCatModalOpen}
				onClose={() => setIsCatModalOpen(false)}
				categories={categories}
				onAddCategory={handleAddCategory}
				onRenameCategory={handleRenameCategory}
				onDeleteCategory={handleDeleteCategory}
			/>

			<ConfirmModal
				isOpen={confirmState.isOpen}
				title={confirmState.title}
				message={confirmState.message}
				onConfirm={confirmState.onConfirm}
				onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
			/>
		</div>
	);
};

export default App;
