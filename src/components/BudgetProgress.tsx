import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Edit3, Check, X } from 'lucide-react';
import { Category, BudgetMap, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BudgetProgressProps {
	categories: Category[];
	currentMonthTransactions: Transaction[];
	budgets: BudgetMap;
	onUpdateBudget: (categoryName: string, limit: number) => void;
	currency: string;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
	categories,
	currentMonthTransactions,
	budgets,
	onUpdateBudget,
	currency,
}) => {
	const [editingCategory, setEditingCategory] = useState<string | null>(null);
	const [tempLimit, setTempLimit] = useState<string>('');

	const spentPerCat: { [name: string]: number } = {};
	currentMonthTransactions
		.filter((t) => t.type === 'expense')
		.forEach((t) => {
			spentPerCat[t.category] = (spentPerCat[t.category] || 0) + t.amount;
		});

	const handleStartEdit = (catName: string, currentVal: number) => {
		setEditingCategory(catName);
		setTempLimit(currentVal ? String(currentVal) : '');
	};

	const handleSaveEdit = (catName: string) => {
		const num = parseFloat(tempLimit);
		if (!isNaN(num) && num >= 0) {
			onUpdateBudget(catName, num);
		}
		setEditingCategory(null);
	};

	return (
		<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-base font-bold text-slate-900 dark:text-white">
						Category Budgets
					</h2>
					<p className="text-xs text-slate-500 dark:text-slate-400">
						Set limits and monitor real-time spending thresholds
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((cat) => {
					const spent = spentPerCat[cat.name] || 0;
					const limit = budgets[cat.name] || 0;
					const percentage = limit > 0 ? (spent / limit) * 100 : 0;

					const isOverBudget = limit > 0 && spent > limit;
					const isNearWarning = limit > 0 && percentage >= 80 && !isOverBudget;

					let barColor = 'bg-indigo-600';
					if (isOverBudget) barColor = 'bg-rose-500';
					else if (isNearWarning) barColor = 'bg-amber-500';

					return (
						<div
							key={cat.id}
							className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between transition hover:border-slate-300 dark:hover:border-slate-700"
						>
							<div>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
										<span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
											{cat.name}
										</span>
									</div>

									{editingCategory === cat.name ? (
										<div className="flex items-center gap-1">
											<input
												type="number"
												min="0"
												step="100"
												value={tempLimit}
												onChange={(e) => setTempLimit(e.target.value)}
												className="w-20 px-1.5 py-0.5 text-xs rounded border border-indigo-500 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
												autoFocus
											/>
											<button type="button" onClick={() => handleSaveEdit(cat.name)} className="p-1 text-emerald-600 hover:text-emerald-700" aria-label="Confirm budget limit">
												<Check className="w-3.5 h-3.5" />
											</button>
											<button type="button" onClick={() => setEditingCategory(null)} className="p-1 text-slate-400 hover:text-slate-600" aria-label="Cancel budget editing">
												<X className="w-3.5 h-3.5" />
											</button>
										</div>
									) : (
										<button
											type="button"
											onClick={() => handleStartEdit(cat.name, limit)}
											className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 group"
											title="Edit monthly budget limit"
										>
											<span>Cap: {formatCurrency(limit, currency)}</span>
											<Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
										</button>
									)}
								</div>

								<div className="flex items-baseline justify-between text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
									<span>Spent: {formatCurrency(spent, currency)}</span>
									<span>{limit > 0 ? `${percentage.toFixed(0)}%` : 'No Cap'}</span>
								</div>

								<div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full transition-all duration-500 ${barColor}`}
										style={{ width: `${Math.min(percentage, 100)}%` }}
									/>
								</div>
							</div>

							{isOverBudget && (
								<div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">
									<AlertCircle className="w-3.5 h-3.5 shrink-0" />
									<span>Exceeded by {formatCurrency(spent - limit, currency)}</span>
								</div>
							)}
							{isNearWarning && (
								<div className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
									<AlertTriangle className="w-3.5 h-3.5 shrink-0" />
									<span>Reached {percentage.toFixed(0)}% of limit</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
};
