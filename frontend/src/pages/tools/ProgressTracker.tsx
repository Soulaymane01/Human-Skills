import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, Download, Upload, BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressTracker = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newEntry, setNewEntry] = useState({ date: '', value: '', notes: '' });
  const [chartType, setChartType] = useState('line');
  const [categoryGoals, setCategoryGoals] = useState({});
  const [categoryColors, setCategoryColors] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('progressTrackerData');
    if (savedData) {
      const { categories, goals, colors } = JSON.parse(savedData);
      setCategories(categories || []);
      setCategoryGoals(goals || {});
      setCategoryColors(colors || {});
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('progressTrackerData', JSON.stringify({
      categories,
      goals: categoryGoals,
      colors: categoryColors
    }));
  }, [categories, categoryGoals, categoryColors]);

  const addCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: Date.now(),
        name: newCategory,
        entries: [],
      };
      setCategories([...categories, newCat]);
      setCategoryColors({ ...categoryColors, [newCat.id]: `#${Math.floor(Math.random()*16777215).toString(16)}` });
      setNewCategory('');
    }
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    if (selectedCategory?.id === id) setSelectedCategory(null);
    
    const newGoals = { ...categoryGoals };
    delete newGoals[id];
    setCategoryGoals(newGoals);
    
    const newColors = { ...categoryColors };
    delete newColors[id];
    setCategoryColors(newColors);
  };

  const addEntry = () => {
    if (selectedCategory && newEntry.date && newEntry.value) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedCategory.id) {
          const entries = [...cat.entries, {
            date: newEntry.date,
            value: parseInt(newEntry.value),
            notes: newEntry.notes,
            timestamp: new Date().toISOString()
          }].sort((a, b) => a.date.localeCompare(b.date));

          if (categoryGoals[cat.id] && parseInt(newEntry.value) >= categoryGoals[cat.id]) {
            setNotifications(prev => [...prev, {
              id: Date.now(),
              message: `Congratulations! You've reached your goal in ${cat.name}!`,
              timestamp: new Date().toISOString()
            }]);
          }

          return { ...cat, entries };
        }
        return cat;
      });
      setCategories(updatedCategories);
      setNewEntry({ date: '', value: '', notes: '' });
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Category', 'Date', 'Value', 'Notes', 'Goal', 'Progress'].join(','),
      ...categories.flatMap(category => 
        category.entries.map(entry => [
          `"${category.name.replace(/"/g, '""')}"`,
          `"${new Date(entry.date).toLocaleDateString()}"`,
          entry.value,
          `"${entry.notes.replace(/"/g, '""')}"`,
          categoryGoals[category.id] || 'N/A',
          `${getProgress(category)}%`
        ].join(','))
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = 'progress-tracker-export.csv';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced Export Button Group
  const exportData = () => {
    const dataStr = JSON.stringify({ categories, categoryGoals, categoryColors });
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'progress-tracker-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const ExportButtons = () => (
    <div className="flex gap-2">
      <button
        onClick={exportData}
        className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-1 text-sm hover:bg-green-600 transition-colors"
      >
        <Download size={16} /> JSON
      </button>
      <button
        onClick={exportCSV}
        className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1 text-sm hover:bg-blue-600 transition-colors"
      >
        <Download size={16} /> CSV
      </button>
      <label className="bg-purple-500 text-white px-3 py-2 rounded flex items-center gap-1 text-sm hover:bg-purple-600 transition-colors cursor-pointer">
        <Upload size={16} /> Import
        <input
          type="file"
          accept=".json,.csv"
          onChange={importData}
          className="hidden"
        />
      </label>
    </div>
  );


  const importData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setCategories(data.categories || []);
        setCategoryGoals(data.categoryGoals || {});
        setCategoryColors(data.categoryColors || {});
      } catch (error) {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: 'Error importing data. Please check the file format.',
          timestamp: new Date().toISOString()
        }]);
      }
    };
    reader.readAsText(file);
  };

  const getProgress = (category) => {
    if (!category.entries.length) return 0;
    const latest = category.entries[category.entries.length - 1].value;
    const goal = categoryGoals[category.id] || 10;
    return Math.round((latest / goal) * 100);
  };

  const calculateStreak = (entries) => {
    if (!entries.length) return 0;
    let streak = 1;
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const curr = new Date(sortedEntries[i-1].date);
      const prev = new Date(sortedEntries[i].date);
      const diffMonths = (curr.getFullYear() - prev.getFullYear()) * 12 + 
        (curr.getMonth() - prev.getMonth());
      
      if (diffMonths === 1) streak++;
      else break;
    }
    return streak;
  };


  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Personal Growth Tracker</h1>
            <div className="flex gap-2">
              <ExportButtons />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="space-y-2 mb-6">
              {notifications.map(notification => (
                <div key={notification.id} className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                  <span>{notification.message}</span>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Category Section */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex gap-2 mb-6">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
                chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            >
            <LineChart size={16} /> Line
            </button>
            <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
                chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            >
            <BarChart2 size={16} /> Bar
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1  gap-4">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`bg-white rounded-lg border ${
                  selectedCategory?.id === category.id ? 'ring-2 ring-blue-500' : ''
                } shadow-sm`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <div className="text-sm text-gray-500">
                        Streak: {calculateStreak(category.entries)} months
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">{getProgress(category)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${getProgress(category)}%` }}
                      />
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'line' ? (
                        <LineChart data={category.entries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, categoryGoals[category.id] || 10]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={categoryColors[category.id] || '#3b82f6'}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={category.entries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, categoryGoals[category.id] || 10]} />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill={categoryColors[category.id] || '#3b82f6'}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Goal Setting */}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={categoryGoals[category.id] || ''}
                      onChange={(e) => setCategoryGoals({
                        ...categoryGoals,
                        [category.id]: parseInt(e.target.value)
                      })}
                      placeholder="Set goal"
                      className="border rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="color"
                      value={categoryColors[category.id] || '#3b82f6'}
                      onChange={(e) => setCategoryColors({
                        ...categoryColors,
                        [category.id]: e.target.value
                      })}
                      className="w-8 h-8 p-0 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Entry Section */}
          {selectedCategory && (
            <div className="mt-6 bg-white rounded-lg border shadow-sm">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Add Entry for {selectedCategory.name}</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <input
                      type="month"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      min="0"
                      max={categoryGoals[selectedCategory.id] || 10}
                      value={newEntry.value}
                      onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
                      placeholder="Value (0-10)"
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="Add notes for this entry..."
                    className="border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addEntry}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition-colors w-full justify-center"
                  >
                    <Save size={16} /> Save Entry
                  </button>
                </div>

                {/* Previous Entries */}
                {selectedCategory.entries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Previous Entries</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {[...selectedCategory.entries].reverse().map((entry, index) => (
                        <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{entry.date}</span>
                            <span>Value: {entry.value}</span>
                          </div>
                          {entry.notes && (
                            <p className="mt-1 text-sm text-gray-700">{entry.notes}</p>
                          )}
                          <span className="text-xs text-gray-400 block mt-1">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;