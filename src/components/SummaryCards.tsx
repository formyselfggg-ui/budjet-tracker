import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Pencil, Check, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardsProps {
	income: number;
	expenses: number;
	balance: number;
	currency: string;
	onUpdateBalance: (balance: number) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ income, expenses, balance, currency, onUpdateBalance }) => {
	const [isEditingBalance, setIsEditingBalance] = useState(false);
	const [balanceInput, setBalanceInput] = useState(String(balance));
	const savingsRate = income > 0 ? Math.max(0, ((income - expenses) / income) * 100) : 0;

	const cards = [
		{
			title: 'Total Income',
			value: formatCurrency(income, currency),
			icon: TrendingUp,
			color: 'text-emerald-600 dark:text-emerald-400',
			bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
		},
		{
			title: 'Total Expenses',
			value: formatCurrency(expenses, currency),
			icon: TrendingDown,
			color: 'text-rose-600 dark:text-rose-400',
			bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
		},
		{
			title: 'Savings Rate',
			value: `${savingsRate.toFixed(1)}%`,
			icon: PiggyBank,
			color: 'text-sky-600 dark:text-sky-400',
			bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
		},
	];

	return (
		<section aria-label="Month Financial Overview" className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
			<div className="flex min-h-52 flex-col justify-between rounded-2xl bg-indigo-700 p-5 text-white shadow-md dark:bg-indigo-950 sm:p-6">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-sm font-medium text-indigo-100">Current Budget Balance</p>
						<p className="mt-1 text-xs text-indigo-200">Income minus expenses, plus adjustments</p>
					</div>
					<div className="rounded-xl border border-white/15 bg-white/10 p-2.5">
						<Wallet className="h-5 w-5" />
					</div>
				</div>

				{isEditingBalance ? (
					<form
						className="mt-5 flex items-center gap-2"
						onSubmit={(event) => {
							event.preventDefault();
							const updatedBalance = Number(balanceInput);
							if (balanceInput.trim() && Number.isFinite(updatedBalance)) {
								onUpdateBalance(updatedBalance);
								setIsEditingBalance(false);
							}
						}}
					>
						<label className="sr-only" htmlFor="current-budget-balance">Current budget balance</label>
						<input
							id="current-budget-balance"
							autoFocus
							type="number"
							step="0.01"
							value={balanceInput}
							onChange={(event) => setBalanceInput(event.target.value)}
							className="min-w-0 flex-1 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xl font-bold text-white outline-none placeholder:text-indigo-200 focus:ring-2 focus:ring-white/70"
						/>
						<button type="submit" aria-label="Save budget balance" title="Save balance" className="rounded-lg bg-white/15 p-2.5 transition hover:bg-white/25">
							<Check className="h-5 w-5" />
						</button>
						<button
							type="button"
							aria-label="Cancel editing balance"
							title="Cancel"
							onClick={() => setIsEditingBalance(false)}
							className="rounded-lg bg-white/15 p-2.5 transition hover:bg-white/25"
						>
							<X className="h-5 w-5" />
						</button>
					</form>
				) : (
					<div className="mt-5 flex items-end justify-between gap-3">
						<p className="min-w-0 break-words text-3xl font-bold sm:text-4xl">{formatCurrency(balance, currency)}</p>
						<button
							type="button"
							aria-label="Edit current budget balance"
							title="Edit balance"
							onClick={() => {
								setBalanceInput(String(balance));
								setIsEditingBalance(true);
							}}
							className="shrink-0 rounded-lg bg-white/15 p-2.5 transition hover:bg-white/25"
						>
							<Pencil className="h-4 w-4" />
						</button>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{cards.map((card, i) => {
				const IconComponent = card.icon;
				return (
					<div
						key={i}
						className="flex min-h-36 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
					>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</span>
							<div className={`p-2.5 rounded-xl border ${card.bg}`}>
								<IconComponent className={`w-5 h-5 ${card.color}`} />
							</div>
						</div>
						<div className="mt-3">
							<h2 className="break-words text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
								{card.value}
							</h2>
						</div>
					</div>
				);
			})}
			</div>
		</section>
	);
};
