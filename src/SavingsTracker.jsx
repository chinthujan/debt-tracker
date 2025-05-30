import React, { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { X } from 'lucide-react';

export default function SavingsTracker() {
  const [goals, setGoals] = useState(() => {
    const stored = localStorage.getItem('savingsGoals');
    return stored ? JSON.parse(stored) : [];
  });

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    const amount = parseFloat(targetAmount);
    if (!name || isNaN(amount) || amount <= 0) return;

    setGoals(prev => [
      ...prev,
      { id: Date.now(), name, targetAmount: amount, saved: 0 },
    ]);
    setName('');
    setTargetAmount('');
  };

  const addContribution = (id, amount) => {
    setGoals(goals.map(goal =>
      goal.id === id
        ? { ...goal, saved: Math.min(goal.saved + amount, goal.targetAmount) }
        : goal
    ));
  };

  const deleteGoal = id => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Savings Goal</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Goal Name" value={name} onChange={e => setName(e.target.value)} />
          <Input type="number" placeholder="Target Amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
          <Button onClick={addGoal}>Add Goal</Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No savings goals yet. Start one above!</p>
      ) : (
        <div className="grid gap-4">
          {goals.map(goal => {
            const progress = (goal.saved / goal.targetAmount) * 100;
            const isComplete = goal.saved >= goal.targetAmount;

            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md relative">
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
                <h3 className="text-xl font-semibold mb-2">{goal.name}</h3>
                <Progress value={progress} className="h-3 rounded bg-blue-200 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  ${goal.saved.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                </p>
                {isComplete ? (
                  <p className="text-green-500 font-semibold text-center">🎉 Goal reached!</p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Add contribution"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            addContribution(goal.id, value);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.querySelector(`#contribution-${goal.id}`);
                        const value = parseFloat(input?.value);
                        if (!isNaN(value) && value > 0) {
                          addContribution(goal.id, value);
                          input.value = '';
                        }
                      }}
                    >
                      Save
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
