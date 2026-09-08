import type { Summary } from '../types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

interface SummaryCardProps {
  summary: Summary | null;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  if (!summary) {
    return null;
  }

  return (
    <section className="summary-card">
      <div className="summary-item">
        <span className="summary-label">Balance</span>
        <span className={`summary-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
          {currencyFormatter.format(summary.balance)}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total income</span>
        <span className="summary-value positive">{currencyFormatter.format(summary.totalIncome)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total expenses</span>
        <span className="summary-value negative">
          {currencyFormatter.format(summary.totalExpense)}
        </span>
      </div>
    </section>
  );
}
