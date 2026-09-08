import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Summary } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

interface ExpenseChartProps {
  summary: Summary | null;
}

export default function ExpenseChart({ summary }: ExpenseChartProps) {
  const expenses = (summary?.byCategory ?? []).filter((item) => item.type === 'expense');

  if (expenses.length === 0) {
    return (
      <div>
        <h2>Expenses by category</h2>
        <p className="muted">No expenses to chart yet.</p>
      </div>
    );
  }

  const data = {
    labels: expenses.map((item) => item.category),
    datasets: [
      {
        data: expenses.map((item) => item.total),
        backgroundColor: expenses.map((_, index) => COLORS[index % COLORS.length]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Expenses by category</h2>
      <div className="chart-canvas">
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
          }}
        />
      </div>
    </div>
  );
}
