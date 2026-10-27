import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionListProps {
	transactions: Transaction[];
	categories: Category[];
	currency: string;
	onEdit: (tx: Transaction) => void;
	onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
	transactions,
	categories,
	currency,
	onEdit,
	onDelete,
}) => {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}
		debounceTimeout.current = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, [search]);
	const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const filteredTransactions = useMemo(() => {
		return transactions.filter((t) => {
			const matchesSearch =
				t.note?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
				t.category.toLowerCase().includes(debouncedSearch.toLowerCase());
			const matchesType = typeFilter === 'all' || t.type === typeFilter;
			const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
			const matchesStart = !startDate || t.date >= startDate;
			const matchesEnd = !endDate || t.date <= endDate;
			return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd;
		});
	}, [transactions, debouncedSearch, typeFilter, categoryFilter, startDate, endDate]);

	const getCategoryColor = (catName: string) => {
		const match = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
		return match ? match.color : '#64748B';
	};

	return (
		<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
				<div>
					<h2 className="text-base font-bold text-slate-900 dark:text-white">
						Transactions
					</h2>
					<p className="text-xs text-slate-500 dark:text-slate-400">
						Showing {filteredTransactions.length} of {transactions.length} record(s)
					</p>
				</div>

				<div className="relative w-full md:w-64">
					<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Search note or category..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
				<div>
					<label htmlFor="filter-type" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
						Type
					</label>
					<select
						id="filter-type"
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
						className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
					>
						<option value="all">All Types</option>
						<option value="income">Income</option>
						<option value="expense">Expense</option>
					</select>
				</div>

				<div>
					<label htmlFor="filter-cat" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
						Category
					</label>
					<select
						id="filter-cat"
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
					>
						<option value="all">All Categories</option>
						{categories.map((c) => (
							<option key={c.id} value={c.name}>
								{c.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="filter-start" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
						Start Date
					</label>
					<input
						type="date"
						id="filter-start"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
					/>
				</div>

				<div>
					<label htmlFor="filter-end" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
						End Date
					</label>
					<input
						type="date"
						id="filter-end"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
					/>
				</div>
			</div>

			{filteredTransactions.length === 0 ? (
				<div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
					<Filter className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
					<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
						No transactions match the selected filters.
					</p>
					<p className="text-xs text-slate-400 mt-1">
						Try adjusting search terms or add a new transaction above.
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
								<th className="pb-3 font-semibold">Type &amp; Category</th>
								<th className="pb-3 font-semibold">Note</th>
								<th className="pb-3 font-semibold">Date</th>
								<th className="pb-3 font-semibold text-right">Amount</th>
								<th className="pb-3 font-semibold text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
							{filteredTransactions.map((tx) => {
								const isExpense = tx.type === 'expense';
								return (
									<tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
										<td className="py-3.5 pr-3">
											<div className="flex items-center gap-2.5">
												<div className={`p-2 rounded-xl ${
													isExpense
														? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
														: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
												}`}>
													{isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
												</div>
												<div>
													<span className="font-semibold text-slate-800 dark:text-slate-200 block">
														{tx.category}
													</span>
													<div className="flex items-center gap-1.5 mt-0.5">
														<span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(tx.category) }} />
														<span className="text-[11px] uppercase text-slate-400 font-medium">
															{tx.type}
														</span>
													</div>
												</div>
											</div>
										</td>
										<td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-[220px] truncate">
											{tx.note || <span className="text-slate-400 italic">No note</span>}
										</td>
										<td className="py-3.5 px-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
											{formatDate(tx.date)}
										</td>
										<td className="py-3.5 px-3 text-right whitespace-nowrap">
											<span className={`font-bold ${
												isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
											}`}>
												{isExpense ? '-' : '+'}
												{formatCurrency(tx.amount, currency)}
											</span>
										</td>
										<td className="py-3.5 pl-3 text-center">
											<div className="flex items-center justify-center gap-1">
												<button
													type="button"
													onClick={() => onEdit(tx)}
													aria-label={`Edit ${tx.category} transaction`}
													className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
												>
													<Edit2 className="w-3.5 h-3.5" />
												</button>
												<button
													type="button"
													onClick={() => onDelete(tx.id)}
													aria-label={`Delete ${tx.category} transaction`}
													className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};
