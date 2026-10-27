import { Transaction } from '../types';

export const exportTransactionsToCSV = (
	transactions: Transaction[],
	currencySymbol: string
): void => {
	if (transactions.length === 0) {
		alert('No transactions found to export.');
		return;
	}

	const headers = ['Transaction ID', 'Date', 'Type', 'Category', `Amount (${currencySymbol})`, 'Note'];
	const rows = transactions.map((t) => [
		`"${t.id}"`,
		`"${t.date}"`,
		`"${t.type.toUpperCase()}"`,
		`"${t.category.replace(/"/g, '""')}"`,
		t.amount.toFixed(2),
		`"${(t.note || '').replace(/"/g, '""')}"`,
	]);

	const csvContent =
		'data:text/csv;charset=utf-8,' +
		[headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement('a');
	link.setAttribute('href', encodedUri);
	link.setAttribute('download', `budget_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
