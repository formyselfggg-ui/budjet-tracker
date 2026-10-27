import React from 'react';
import { Sun, Moon, Download, Plus, Tags, Calendar } from 'lucide-react';
import { AVAILABLE_CURRENCIES } from '../utils/formatters';

interface NavbarProps {
	selectedMonth: string;
	onMonthChange: (month: string) => void;
	theme: 'light' | 'dark';
	onToggleTheme: () => void;
	currency: string;
	onCurrencyChange: (currency: string) => void;
	onOpenAddModal: () => void;
	onOpenCategoryModal: () => void;
	onExportCSV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
	selectedMonth,
	onMonthChange,
	theme,
	onToggleTheme,
	currency,
	onCurrencyChange,
	onOpenAddModal,
	onOpenCategoryModal,
	onExportCSV,
}) => {
	return (
		<header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
						₱
					</div>
					<div>
						<h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
							BudgetTracker
						</h1>
						<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
							Personal Wealth Ledger
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2 sm:gap-3">
					<div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
						<Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
						<input
							type="month"
							aria-label="Filter by month"
							value={selectedMonth}
							onChange={(e) => e.target.value && onMonthChange(e.target.value)}
							className="bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
						/>
					</div>

					<select
						aria-label="Select default currency"
						value={currency}
						onChange={(e) => onCurrencyChange(e.target.value)}
						className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						{AVAILABLE_CURRENCIES.map((c) => (
							<option key={c.code} value={c.symbol}>
								{c.label}
							</option>
						))}
					</select>

					<button
						type="button"
						onClick={onToggleTheme}
						aria-label="Toggle light and dark mode"
						className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition"
					>
						{theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
					</button>

					<button
						type="button"
						onClick={onExportCSV}
						title="Download CSV export"
						className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition"
					>
						<Download className="w-4 h-4" />
						<span className="hidden sm:inline">Export CSV</span>
					</button>

					<button
						type="button"
						onClick={onOpenCategoryModal}
						className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition"
					>
						<Tags className="w-4 h-4" />
						<span className="hidden sm:inline">Categories</span>
					</button>

					<button
						type="button"
						onClick={onOpenAddModal}
						className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-sm hover:shadow transition"
					>
						<Plus className="w-4 h-4" />
						<span>Add Transaction</span>
					</button>
				</div>
			</div>
		</header>
	);
};
