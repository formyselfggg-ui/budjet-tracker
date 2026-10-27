import React from 'react';
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
} from 'recharts';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DashboardChartsProps {
	currentMonthTransactions: Transaction[];
	allTransactions: Transaction[];
	categories: Category[];
	currency: string;
	selectedMonth: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
	currentMonthTransactions,
	allTransactions,
	categories,
	currency,
	selectedMonth,
}) => {
	const expenseTransactions = currentMonthTransactions.filter((t) => t.type === 'expense');
	const catSums: { [cat: string]: number } = {};
	expenseTransactions.forEach((t) => {
		catSums[t.category] = (catSums[t.category] || 0) + t.amount;
	});

	const pieData = Object.entries(catSums)
		.map(([name, value]) => {
			const match = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
			return {
				name,
				value,
				color: match ? match.color : '#94A3B8',
			};
		})
		.sort((a, b) => b.value - a.value);

	const [currYear, currMonth] = selectedMonth.split('-').map(Number);
	const last6Months: string[] = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(currYear, currMonth - 1 - i, 1);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		last6Months.push(`${y}-${m}`);
	}

	const trendData = last6Months.map((mKey) => {
		const [y, m] = mKey.split('-');
		const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', {
			month: 'short',
		});
		const monthlyTxs = allTransactions.filter((t) => t.date.startsWith(mKey));
		const income = monthlyTxs
			.filter((t) => t.type === 'income')
			.reduce((sum, t) => sum + t.amount, 0);
		const expense = monthlyTxs
			.filter((t) => t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0);

		return {
			month: label,
			Income: income,
			Expense: expense,
		};
	});

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
				<h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
					Expenses by Category
				</h3>
				<p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
					Spending distribution for the selected month
				</p>

				{pieData.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500">
						<p className="text-sm font-medium">No expenses logged for this month.</p>
						<span className="text-xs mt-1">Add an expense to view category distribution.</span>
					</div>
				) : (
					<div className="h-72 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={pieData} innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), 'Spent']}
									contentStyle={{
										backgroundColor: '#0F172A',
										borderRadius: '10px',
										color: '#FFF',
										border: 'none',
										boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
									}}
									itemStyle={{ color: '#FFF' }}
								/>
								<Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
							</PieChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>

			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
				<h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
					6-Month Cash Flow Trend
				</h3>
				<p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
					Comparison of earnings versus outgoing expenditures
				</p>

				<div className="h-72 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
							<XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
							<YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
							<Tooltip
								formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), '']}
								contentStyle={{
									backgroundColor: '#0F172A',
									borderRadius: '10px',
									color: '#FFF',
									border: 'none',
									boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
								}}
							/>
							<Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
							<Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
							<Bar dataKey="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};
