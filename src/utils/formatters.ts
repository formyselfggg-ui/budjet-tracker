import { Currency } from '../types';

export const AVAILABLE_CURRENCIES: Currency[] = [
	{ code: 'PHP', symbol: '₱', label: 'PHP (₱)' },
	{ code: 'USD', symbol: '$', label: 'USD ($)' },
	{ code: 'EUR', symbol: '€', label: 'EUR (€)' },
	{ code: 'GBP', symbol: '£', label: 'GBP (£)' },
	{ code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
];

export const formatCurrency = (amount: number, symbol: string = '₱'): string => {
	const formatted = Math.abs(amount).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
};

export const formatDate = (dateString: string): string => {
	if (!dateString) return '';
	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

export const getCurrentMonthKey = (): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
};
