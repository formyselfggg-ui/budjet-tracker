import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null;

	return (
		<div role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
				<div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
					<AlertTriangle className="w-6 h-6" />
				</div>
				<h4 id="confirm-dialog-title" className="text-base font-bold text-slate-900 dark:text-white mb-2">
					{title}
				</h4>
				<p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
					{message}
				</p>
				<div className="flex items-center justify-center gap-3">
					<button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
						Cancel
					</button>
					<button type="button" onClick={onConfirm} className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition">
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};
