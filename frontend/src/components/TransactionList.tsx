import type { Transaction } from '../types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionList({
  transactions,
  loading,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (loading) {
    return <p className="muted">Loading transactions...</p>;
  }

  if (transactions.length === 0) {
    return <p className="muted">No transactions found. Add your first one!</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="transaction-item">
          <div className="transaction-main">
            <span className={`badge badge-${transaction.type}`}>{transaction.type}</span>
            <div>
              <p className="transaction-category">{transaction.category}</p>
              {transaction.description && (
                <p className="transaction-description">{transaction.description}</p>
              )}
              <p className="transaction-date">{transaction.date}</p>
            </div>
          </div>
          <p className={`transaction-amount amount-${transaction.type}`}>
            {transaction.type === 'income' ? '+' : '-'}
            {currencyFormatter.format(transaction.amount)}
          </p>
          <div className="transaction-actions">
            <button type="button" onClick={() => onEdit(transaction)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => onDelete(transaction.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
