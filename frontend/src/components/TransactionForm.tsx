import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { createTransaction, updateTransaction } from '../api';
import type { Transaction, TransactionType } from '../types';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Salary', 'Other'];

const getToday = (): string => new Date().toLocaleDateString('en-CA');

interface TransactionFormProps {
  editing: Transaction | null;
  onSaved: () => void;
  onCancelEdit: () => void;
}

export default function TransactionForm({ editing, onSaved, onCancelEdit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getToday);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    setType(editing.type);
    setAmount(String(editing.amount));
    setCategory(editing.category);
    setDescription(editing.description ?? '');
    setDate(editing.date.slice(0, 10));
    setError(null);
  }, [editing]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(getToday());
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a number greater than 0');
      return;
    }
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    const payload = {
      type,
      amount: Math.round(parsedAmount * 100) / 100,
      category: category.trim(),
      description: description.trim() || undefined,
      date,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateTransaction(editing.id, payload);
      } else {
        await createTransaction(payload);
      }
      resetForm();
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit transaction' : 'New transaction'}</h2>

      <label>
        Type
        <select value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      <label>
        Amount
        <input
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
      </label>

      <label>
        Category
        <input
          list="category-options"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g. Food"
          required
        />
      </label>
      <datalist id="category-options">
        {CATEGORIES.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>

      <label>
        Date
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      </label>

      <label>
        Description (optional)
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={255}
          placeholder="e.g. Weekly groceries"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Update transaction' : 'Add transaction'}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
