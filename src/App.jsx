// src/App.jsx
import React, { useState } from 'react';
import DebtTracker from './DebtTracker';
import SavingsTracker from './SavingsTracker';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('debt');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <Button onClick={() => setActiveTab('debt')} variant={activeTab === 'debt' ? 'default' : 'outline'}>
                Debt Tracker
              </Button>
              <Button onClick={() => setActiveTab('savings')} variant={activeTab === 'savings' ? 'default' : 'outline'}>
                Savings Tracker
              </Button>
            </div>
            <Button variant="ghost" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <div className="rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
            {activeTab === 'debt' ? <DebtTracker /> : <SavingsTracker />}
          </div>
        </div>
      </div>
    </div>
  );
}
