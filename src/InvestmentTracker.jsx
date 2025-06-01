import React, { useState, useEffect } from 'react';
import { Progress } from './components/ui/progress';

function monthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  // if end date's day is less than start date's day, subtract 1 month
  if (end.getDate() < start.getDate()) months--;
  return months < 0 ? 0 : months;
}

export default function InvestmentTracker() {
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('passiveIncomeInvestments');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    localStorage.setItem('passiveIncomeInvestments', JSON.stringify(investments));
  }, [investments]);

  const handleAddInvestment = () => {
    if (!name || !principal || !interestRate || !startDate) {
      alert('Please fill in all fields');
      return;
    }
    if (principal <= 0 || interestRate <= 0) {
      alert('Principal and Interest Rate must be positive numbers');
      return;
    }

    const newInvestment = {
      id: Date.now(),
      name,
      principal: parseFloat(principal),
      interestRate: parseFloat(interestRate),
      startDate,
    };

    setInvestments((prev) => [...prev, newInvestment]);
    setName('');
    setPrincipal('');
    setInterestRate('');
    setStartDate('');
  };

  const handleDelete = (id) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
  };

  // Calculate interest earned for an investment
  const calcInterestEarned = (inv) => {
    const today = new Date();
    const monthsElapsed = monthsBetween(inv.startDate, today);
    const interest = inv.principal * (inv.interestRate / 100) * monthsElapsed;
    return interest.toFixed(2);
  };

  const totalInterestEarned = investments.reduce(
    (sum, inv) => sum + parseFloat(calcInterestEarned(inv)),
    0
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Passive Income Investments</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Investment Name"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Principal Amount ($)"
            min="0"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <input
            type="number"
            placeholder="Monthly Interest Rate (%)"
            min="0"
            step="0.01"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <button
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
          onClick={handleAddInvestment}
        >
          Add Investment
        </button>
      </div>

      {investments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No passive income investments added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{inv.name}</h3>
                <p>
                  Principal: <span className="font-mono">${inv.principal.toLocaleString()}</span>
                </p>
                <p>
                  Monthly Interest Rate: <span className="font-mono">{inv.interestRate}%</span>
                </p>
                <p>
                  Start Date: <span className="font-mono">{inv.startDate}</span>
                </p>
                <p>
                  Interest Earned:{' '}
                  <span className="font-mono text-green-600">${calcInterestEarned(inv)}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(inv.id)}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
                aria-label="Delete Investment"
              >
                ×
              </button>
            </div>
          ))}

          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg font-semibold text-green-800 dark:text-green-200 text-center">
            Total Interest Earned: ${totalInterestEarned.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
