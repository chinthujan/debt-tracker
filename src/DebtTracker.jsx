// src/DebtTracker.jsx
import React, { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { X } from 'lucide-react';

export default function DebtTracker() {
  const [debts, setDebts] = useState(() => {
    const stored = localStorage.getItem('debts');
    return stored ? JSON.parse(stored) : [];
  });

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const addDebt = () => {
    const parsedAmount = parseFloat(amount);
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0) return;

    setDebts(prev => [
      ...prev,
      { id: Date.now(), name, total: parsedAmount, paid: 0 },
    ]);
    setName('');
    setAmount('');
  };

  const addPayment = (id, paymentAmount) => {
    setDebts(debts.map(debt =>
      debt.id === id
        ? { ...debt, paid: Math.min(debt.paid + paymentAmount, debt.total) }
        : debt
    ));
  };

  const deleteDebt = id => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Add New Debt</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Debt Name" value={name} onChange={e => setName(e.target.value)} />
          <Input type="number" placeholder="Amount Owed" value={amount} onChange={e => setAmount(e.target.value)} />
          <Button onClick={addDebt}>Add Debt</Button>
        </div>
      </div>

      {debts.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No debts added. Start tracking one above!</p>
      ) : (
        <div className="grid gap-4">
          {debts.map(debt => {
            const progress = (debt.paid / debt.total) * 100;
            const isCleared = debt.paid >= debt.total;

            return (
              <div key={debt.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md relative">
                <button
                  onClick={() => deleteDebt(debt.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
                <h3 className="text-xl font-semibold mb-2">{debt.name}</h3>
                <Progress value={progress} className="h-3 rounded bg-blue-200 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  ${debt.paid.toLocaleString()} / ${debt.total.toLocaleString()}
                </p>
                {isCleared ? (
                  <p className="text-green-500 font-semibold text-center">🎉 Debt cleared!</p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Add payment"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            addPayment(debt.id, value);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.querySelector(`#payment-${debt.id}`);
                        const value = parseFloat(input?.value);
                        if (!isNaN(value) && value > 0) {
                          addPayment(debt.id, value);
                          input.value = '';
                        }
                      }}
                    >
                      Pay
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}