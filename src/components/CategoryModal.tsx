import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Category } from '../types';

interface CategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
	onAddCategory: (name: string, color: string) => void;
	onRenameCategory: (id: string, newName: string) => void;
	onDeleteCategory: (id: string, name: string) => void;
}

const PALETTE = [
	'#F97316', '#3B82F6', '#EF4444', '#8B5CF6',
	'#EC4899', '#10B981', '#F59E0B', '#06B6D4',
	'#6366F1', '#14B8A6', '#64748B', '#84CC16',
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
	isOpen,
	onClose,
	categories,
	onAddCategory,
	onRenameCategory,
	onDeleteCategory,
}) => {
	const [newCatName, setNewCatName] = useState('');
	const [newCatColor, setNewCatColor] = useState(PALETTE[0]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = newCatName.trim();
		if (!trimmed) {
			setError('Category name cannot be empty.');
			return;
		}
		if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
			setError('Category already exists.');
			return;
		}
		onAddCategory(trimmed, newCatColor);
		setNewCatName('');
		setError('');
	};

	const startRename = (cat: Category) => {
		setEditingId(cat.id);
		setEditName(cat.name);
	};

	const saveRename = (catId: string) => {
		const trimmed = editName.trim();
		if (!trimmed) return;
		onRenameCategory(catId, trimmed);
		setEditingId(null);
	};

	return (
		<div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
				<div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
					<h3 className="text-lg font-bold text-slate-900 dark:text-white">
						Manage Categories
					</h3>
					<button type="button" onClick={onClose} aria-label="Close modal" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg">
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="p-5 overflow-y-auto space-y-6">
					<form onSubmit={handleAdd} className="space-y-3">
						<span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
							Create Category
						</span>
						{error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
						<div className="flex gap-2">
							<input type="text" placeholder="Category name..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
							<button type="submit" className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition">
								<Plus className="w-4 h-4" /> Add
							</button>
						</div>

						<div className="flex items-center gap-2 flex-wrap pt-1">
							<span className="text-xs text-slate-400 mr-1">Color:</span>
							{PALETTE.map((color) => (
								<button
									type="button"
									key={color}
									onClick={() => setNewCatColor(color)}
									style={{ backgroundColor: color }}
									aria-label={`Select color ${color}`}
									aria-pressed={newCatColor === color}
									className={`w-6 h-6 rounded-full transition-transform ${newCatColor === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'}`}
								/>
							))}
						</div>
					</form>

					<div className="space-y-2">
						<span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
							All Categories
						</span>
						<div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
							{categories.map((c) => (
								<div key={c.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
									<div className="flex items-center gap-2.5 flex-1">
										<span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
										{editingId === c.id ? (
											<input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="px-2 py-0.5 text-sm bg-slate-100 dark:bg-slate-800 rounded border border-indigo-400 focus:outline-none dark:text-white" autoFocus />
										) : (
											<span className="text-sm font-medium text-slate-800 dark:text-slate-200">
												{c.name}
											</span>
										)}
									</div>

									<div className="flex items-center gap-1">
										{editingId === c.id ? (
											<button type="button" onClick={() => saveRename(c.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg" aria-label="Confirm rename">
												<Check className="w-4 h-4" />
											</button>
										) : (
											<button type="button" onClick={() => startRename(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg" aria-label="Rename category">
												<Edit2 className="w-3.5 h-3.5" />
											</button>
										)}

										<button type="button" onClick={() => onDeleteCategory(c.id, c.name)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg" aria-label="Delete category">
											<Trash2 className="w-3.5 h-3.5" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
