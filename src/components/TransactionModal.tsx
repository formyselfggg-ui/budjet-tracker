import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>, id?: string) => void;
	categories: Category[];
	editingTransaction: Transaction | null;
	defaultMonth: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
	isOpen,
	onClose,
	onSave,
	categories,
	editingTransaction,
	defaultMonth,
}) => {
	const [type, setType] = useState<TransactionType>('expense');
	const [amount, setAmount] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	const [date, setDate] = useState<string>('');
	const [note, setNote] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (editingTransaction) {
			setType(editingTransaction.type);
			setAmount(String(editingTransaction.amount));
			setCategory(editingTransaction.category);
			setDate(editingTransaction.date);
			setNote(editingTransaction.note || '');
		} else {
			setType('expense');
			setAmount('');
			setCategory(categories[0]?.name || 'Food');
			const day = new Date().toISOString().slice(8, 10);
			setDate(`${defaultMonth}-${day}`);
			setNote('');
		}
		setError('');
	}, [editingTransaction, isOpen, categories, defaultMonth]);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const parsedAmount = parseFloat(amount);

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			setError('Amount must be greater than zero.');
			return;
		}
		if (!category.trim()) {
			setError('Please choose a category.');
			return;
		}
		if (!date) {
			setError('Please select a valid date.');
			return;
		}

		onSave(
			{
				type,
				amount: parsedAmount,
				category,
				date,
				note: note.trim() ? note.trim() : undefined,
			},
			editingTransaction ? editingTransaction.id : undefined
		);
		onClose();
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="tx-modal-title"
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
		>
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
				<div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
					<h3 id="tx-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
						{editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
					</h3>
					<button type="button" onClick={onClose} aria-label="Close dialog" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg">
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-5 space-y-4">
					{error && (
						<div className="p-3 text-xs bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800 font-medium">
							{error}
						</div>
					)}

					<div>
						<span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Flow Type
						</span>
						<div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
							<button
								type="button"
								onClick={() => setType('expense')}
								className={`py-2 text-xs font-bold rounded-lg transition ${type === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
							>
								Expense (-)
							</button>
							<button
								type="button"
								onClick={() => setType('income')}
								className={`py-2 text-xs font-bold rounded-lg transition ${type === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
							>
								Income (+)
							</button>
						</div>
					</div>

					<div>
						<label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Amount
						</label>
						<input type="number" id="tx-amount" step="0.01" min="0.01" required placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" />
					</div>

					<div>
						<label htmlFor="tx-category" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Category
						</label>
						<select id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
							{categories.map((c) => (
								<option key={c.id} value={c.name}>
									{c.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="tx-date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Date
						</label>
						<input type="date" id="tx-date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
					</div>

					<div>
						<label htmlFor="tx-note" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Note (Optional)
						</label>
						<input type="text" id="tx-note" placeholder="e.g., Grocery store, fuel, bonus" value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
					</div>

					<div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
						<button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
							Cancel
						</button>
						<button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition">
							{editingTransaction ? 'Save Changes' : 'Record Transaction'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
