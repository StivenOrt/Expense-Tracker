import { useCallback, useEffect, useState } from 'react';
import { deleteTransaction, fetchSummary, fetchTransactions } from './api';
import ExpenseChart from './components/ExpenseChart';
import Filters from './components/Filters';
import SummaryCard from './components/SummaryCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import type { ListFilters, Summary, Transaction } from './types';

const EMPTY_FILTERS: ListFilters = {};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filters, setFilters] = useState<ListFilters>(EMPTY_FILTERS);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, totals] = await Promise.all([fetchTransactions(filters), fetchSummary()]);
      setTransactions(list);
      setSummary(totals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this transaction?')) {
      return;
    }
    try {
      await deleteTransaction(id);
      void loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  const handleSaved = () => {
    setEditing(null);
    void loadData();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <SummaryCard summary={summary} />

      <main className="layout">
        <section className="layout-left">
          <div className="panel">
            <TransactionForm
              editing={editing}
              onSaved={handleSaved}
              onCancelEdit={() => setEditing(null)}
            />
          </div>
          <div className="panel">
            <ExpenseChart summary={summary} />
          </div>
        </section>

        <section className="panel">
          <Filters filters={filters} onChange={setFilters} />
          <TransactionList
            transactions={transactions}
            loading={loading}
            onEdit={setEditing}
            onDelete={(id) => void handleDelete(id)}
          />
        </section>
      </main>
    </div>
  );
}
