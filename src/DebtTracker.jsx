import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import { X, Sun, Moon } from "lucide-react";

export default function DebtTracker() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const [debts, setDebts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("debts");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [newDebtName, setNewDebtName] = useState("");
  const [newDebtAmount, setNewDebtAmount] = useState("");

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addDebt = () => {
    const amount = parseFloat(newDebtAmount);
    if (!isNaN(amount) && amount > 0 && newDebtName.trim() !== "") {
      setDebts([...debts, { name: newDebtName, total: amount, paid: 0 }]);
      setNewDebtName("");
      setNewDebtAmount("");
    }
  };

  const addPayment = (index, value) => {
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0) {
      const updated = [...debts];
      updated[index].paid = Math.min(updated[index].paid + amount, updated[index].total);
      setDebts(updated);
    }
  };

  const deleteDebt = (index) => {
    setDebts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 space-y-6 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-500 dark:border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <>
              <Sun className="w-5 h-5 text-yellow-400" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-gray-700" />
              Dark Mode
            </>
          )}
        </button>
      </div>

      <Card className="rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-800 text-center">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Add a New Debt</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Debt Name"
              value={newDebtName}
              onChange={(e) => setNewDebtName(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newDebtAmount}
              onChange={(e) => setNewDebtAmount(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button onClick={addDebt}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {debts.map((debt, index) => {
        const remaining = debt.total - debt.paid;
        const progressPercent = Math.min((debt.paid / debt.total) * 100, 100);

        return (
          <Card
            key={index}
            className="relative rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-800 text-center"
          >
            <button
              onClick={() => deleteDebt(index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              aria-label="Delete debt"
            >
              <X size={18} />
            </button>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">{debt.name}</h3>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-3xl font-extrabold mb-4 ${
                  remaining === 0 ? "text-black dark:text-white" : "text-red-600"
                }`}
              >
                ${remaining.toFixed(2)} remaining
              </motion.div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div
                  className="h-4 rounded-full bg-green-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              {remaining > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Input
                    id={`payment-${index}`}
                    type="number"
                    placeholder="Payment Amount"
                    min="0"
                    step="0.01"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addPayment(index, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(`payment-${index}`);
                      if (input && input.value) {
                        addPayment(index, input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add Payment
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-green-600 font-bold text-lg mt-4"
                >
                  🎉 Congratulations! Debt Cleared.
                </motion.div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
