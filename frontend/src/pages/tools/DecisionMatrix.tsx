import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Upload, Scale, ChevronRight, Star, X } from 'lucide-react';

type Criteria = {
  id: string;
  name: string;
  weight: number;
};

type Option = {
  id: string;
  name: string;
  scores: { [criteriaId: string]: number };
  totalScore?: number;
};

export default function DecisionMatrix() {
  const [options, setOptions] = useState<Option[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [newOption, setNewOption] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [matrix, setMatrix] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: string }[]>([]);

  // Load/save data
  useEffect(() => {
    const savedData = localStorage.getItem('decisionMatrix');
    if (savedData) {
      const { options, criteria } = JSON.parse(savedData);
      setOptions(options);
      setCriteria(criteria);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('decisionMatrix', JSON.stringify({ options, criteria }));
  }, [options, criteria]);

  const addOption = () => {
    if (newOption.trim()) {
      const newOpt: Option = {
        id: `opt_${Date.now()}`,
        name: newOption.trim(),
        scores: {}
      };
      setOptions([...options, newOpt]);
      setNewOption('');
    }
  };

  const addCriterion = () => {
    if (newCriteria.trim()) {
      const newCrit: Criteria = {
        id: `crit_${Date.now()}`,
        name: newCriteria.trim(),
        weight: 1
      };
      setCriteria([...criteria, newCrit]);
      setNewCriteria('');
    }
  };

  const deleteOption = (id: string) => {
    setOptions(options.filter(opt => opt.id !== id));
  };

  const deleteCriterion = (id: string) => {
    setCriteria(criteria.filter(crit => crit.id !== id));
  };

  const updateScore = (optionId: string, criteriaId: string, value: number) => {
    const updatedOptions = options.map(opt => {
      if (opt.id === optionId) {
        return {
          ...opt,
          scores: { ...opt.scores, [criteriaId]: Math.min(Math.max(value, 0), 10) }
        };
      }
      return opt;
    });
    setOptions(updatedOptions);
  };

  const updateWeight = (criteriaId: string, weight: number) => {
    setCriteria(criteria.map(crit => 
      crit.id === criteriaId ? { ...crit, weight: Math.min(Math.max(weight, 0), 5) } : crit
    ));
  };

  const calculateTotalScore = (option: Option) => {
    return criteria.reduce((total, crit) => {
      return total + ((option.scores[crit.id] || 0) * crit.weight);
    }, 0);
  };

  const exportData = () => {
    const data = {
      options: options.map(opt => ({
        ...opt,
        totalScore: calculateTotalScore(opt)
      })),
      criteria
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decision-matrix.json';
    link.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setOptions(data.options);
        setCriteria(data.criteria);
      } catch (error) {
        setNotifications([...notifications, {
          id: Date.now(),
          message: 'Invalid file format',
          type: 'error'
        }]);
      }
    };
    reader.readAsText(file);
  };

  const sortedOptions = [...options].sort((a, b) => 
    calculateTotalScore(b) - calculateTotalScore(a)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Decision Making Matrix</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
            <Download size={16} /> Export
          </button>
          <label className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 cursor-pointer">
            <Upload size={16} /> Import
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

      {/* Criteria Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ChevronRight className="w-5 h-5" /> Decision Criteria
        </h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            placeholder="Add new criterion..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={addCriterion}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={16} /> Add Criterion
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {criteria.map(crit => (
            <div key={crit.id} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{crit.name}</span>
                <button
                  onClick={() => deleteCriterion(crit.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={crit.weight}
                  onChange={(e) => updateWeight(crit.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm w-8">{crit.weight}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ChevronRight className="w-5 h-5" /> Options
        </h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Add new option..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={addOption}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={16} /> Add Option
          </button>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="grid gap-4" style={{ 
          gridTemplateColumns: `200px repeat(${criteria.length}, 120px) 150px`
        }}>
          {/* Header Row */}
          <div className="sticky left-0 bg-white z-10"></div>
          {criteria.map(crit => (
            <div key={crit.id} className="text-center font-medium p-2 bg-blue-50 rounded">
              {crit.name} ({crit.weight}x)
            </div>
          ))}
          <div className="text-center font-medium p-2 bg-green-50 rounded">
            Total Score
          </div>

          {/* Data Rows */}
          {sortedOptions.map(option => (
            <React.Fragment key={option.id}>
              <div className="sticky left-0 bg-white z-10 flex items-center justify-between p-2 border-r">
                <span className="font-medium">{option.name}</span>
                <button
                  onClick={() => deleteOption(option.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
              {criteria.map(crit => (
                <div key={crit.id} className="p-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={option.scores[crit.id] || ''}
                    onChange={(e) => updateScore(option.id, crit.id, parseInt(e.target.value))}
                    className="w-full p-1 border rounded text-center"
                  />
                </div>
              ))}
              <div className="p-2 text-center font-semibold bg-green-50 rounded">
                {calculateTotalScore(option)}
                {sortedOptions[0]?.id === option.id && (
                  <Star className="w-4 h-4 ml-1 inline-block text-yellow-500" />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg flex justify-between items-center ${
              notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {notification.message}
            <button
              onClick={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
              className="ml-4 hover:opacity-70"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}