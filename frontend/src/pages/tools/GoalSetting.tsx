import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type GoalType = 'SMART' | 'OKR' | 'HABIT';

interface BaseGoal {
  id: string;
  title: string;
  type: GoalType;
  progress: number;
  createdAt: Date;
}

interface SmartGoal extends BaseGoal {
  type: 'SMART';
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  deadline: string;
}

interface OkrGoal extends BaseGoal {
  type: 'OKR';
  objective: string;
  keyResults: { text: string; progress: number }[];
}

interface HabitGoal extends BaseGoal {
  type: 'HABIT';
  habitStatement: string;
  trigger: string;
  targetDays: number;
  completedDays: number;
}

type Goal = SmartGoal | OkrGoal | HabitGoal;

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<GoalType>('SMART');
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({});

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.title) {
      toast.error('Please enter a title');
      return;
    }

    const baseGoal = {
      id: uuidv4(),
      title: newGoal.title,
      type: activeTab,
      progress: 0,
      createdAt: new Date(),
    };

    let goal: Goal;

    switch (activeTab) {
      case 'SMART':
        goal = {
          ...baseGoal,
          type: 'SMART',
          specific: (newGoal as SmartGoal).specific || '',
          measurable: (newGoal as SmartGoal).measurable || '',
          achievable: (newGoal as SmartGoal).achievable || '',
          relevant: (newGoal as SmartGoal).relevant || '',
          deadline: (newGoal as SmartGoal).deadline || '',
        };
        break;

      case 'OKR':
        goal = {
          ...baseGoal,
          type: 'OKR',
          objective: (newGoal as OkrGoal).objective || '',
          keyResults: (newGoal as OkrGoal).keyResults || [],
        };
        break;

      case 'HABIT':
        goal = {
          ...baseGoal,
          type: 'HABIT',
          habitStatement: (newGoal as HabitGoal).habitStatement || '',
          trigger: (newGoal as HabitGoal).trigger || '',
          targetDays: (newGoal as HabitGoal).targetDays || 30,
          completedDays: (newGoal as HabitGoal).completedDays || 0,
        };
        break;
        default:
            goal = {
              ...baseGoal,
              type: 'SMART',
              specific: '',
              measurable: '',
              achievable: '',
              relevant: '',
              deadline: '',
            };
            break;
    }

    setGoals([...goals, goal]);
    setNewGoal({});
    toast.success('Goal added!');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast.info('Goal deleted');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <ToastContainer position="bottom-right" />

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        {['SMART', 'OKR', 'HABIT'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as GoalType)}
            className={`px-4 py-2 ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {tab} Goals
          </button>
        ))}
      </div>

      {/* Goal Creation */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Create New {activeTab} Goal
        </h2>

        <input
          type="text"
          placeholder="Goal Title"
          value={newGoal.title || ''}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />

        {activeTab === 'SMART' && (
          <div className="grid gap-4 grid-cols-2">
            {['specific', 'measurable', 'achievable', 'relevant', 'deadline'].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === 'deadline' ? 'date' : 'text'}
                    className="w-full p-2 border rounded"
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, [field]: e.target.value })
                    }
                  />
                </div>
              )
            )}
          </div>
        )}

        {activeTab === 'OKR' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Objective
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setNewGoal({ ...newGoal, objective: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Key Results</label>
              {(newGoal as OkrGoal)?.keyResults?.map((kr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Key result ${index + 1}`}
                    className="flex-1 p-2 border rounded"
                    value={kr.text} // Add this line to display the key result text
                    onChange={(e) => {
                      const updatedKeyResults = (newGoal as OkrGoal).keyResults
                        ? [...(newGoal as OkrGoal).keyResults]
                        : [];
                      updatedKeyResults[index] = {
                        ...kr,
                        text: e.target.value,
                      };
                      setNewGoal({ ...newGoal, keyResults: updatedKeyResults });
                    }}
                  />
                  <button
                    className="px-2 text-red-500"
                    onClick={() => {
                      const updatedKeyResults = (newGoal as OkrGoal).keyResults
                        ? [...(newGoal as OkrGoal).keyResults]
                        : [];
                      updatedKeyResults.splice(index, 1);
                      setNewGoal({ ...newGoal, keyResults: updatedKeyResults });
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="text-blue-600 text-sm"
                onClick={() =>
                  setNewGoal({
                    ...newGoal,
                    keyResults: [
                      ...(newGoal as OkrGoal).keyResults || [],
                      { text: '', progress: 0 },
                    ],
                  })
                }
              >
                + Add Key Result
              </button>
            </div>
          </div>
        )}

        {activeTab === 'HABIT' && (
          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Habit Statement
              </label>
              <input
                type="text"
                placeholder="I will..."
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setNewGoal({ ...newGoal, habitStatement: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trigger</label>
              <input
                type="text"
                placeholder="After I..."
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setNewGoal({ ...newGoal, trigger: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Days
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                value={(newGoal as HabitGoal).targetDays || 30}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    targetDays: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        )}

        <button
          onClick={addGoal}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals
          .filter((g) => g.type === activeTab)
          .map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{goal.title}</h3>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>

              {goal.type === 'SMART' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">Specific:</span>{' '}
                    {(goal as SmartGoal).specific}
                  </p>
                  <p>
                    <span className="font-medium">Measurable:</span>{' '}
                    {(goal as SmartGoal).measurable}
                  </p>
                  <p>
                    <span className="font-medium">Achievable:</span>{' '}
                    {(goal as SmartGoal).achievable}
                  </p>
                  <p>
                    <span className="font-medium">Relevant:</span>{' '}
                    {(goal as SmartGoal).relevant}
                  </p>
                  <p>
                    <span className="font-medium">Deadline:</span>{' '}
                    {(goal as SmartGoal).deadline}
                  </p>
                </div>
              )}

              {goal.type === 'OKR' && (
                <div className="space-y-2">
                  <p className="font-medium">Objective:</p>
                  <p>{(goal as OkrGoal).objective}</p>
                  <div className="ml-4 space-y-2">
                    {(goal as OkrGoal).keyResults.map((kr, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={kr.progress === 100}
                          onChange={(e) => {
                            updateGoal(goal.id, {
                              keyResults: (goal as OkrGoal).keyResults.map(
                                (k, i) =>
                                  i === index
                                    ? {
                                        ...k,
                                        progress: e.target.checked ? 100 : 0,
                                      }
                                    : k
                              ),
                              progress: calculateOverallProgress(
                                (goal as OkrGoal).keyResults.map((k, i) =>
                                  i === index
                                    ? {
                                        ...k,
                                        progress: e.target.checked ? 100 : 0,
                                      }
                                    : k
                                )
                              ), // Update overall progress
                            });
                          }}
                        />
                        <span className="flex-1">{kr.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {goal.type === 'HABIT' && (
                <div className="space-y-2">
                  <p className="font-medium">Habit:</p>
                  <p>{(goal as HabitGoal).habitStatement}</p>
                   <div className="flex items-center gap-4">
                    <span className="w-12">{goal.completedDays}/{(goal as HabitGoal).targetDays} days</span>
                    <button
                      onClick={() => {
                        const updatedCompletedDays = Math.min(
                          (goal as HabitGoal).completedDays + 1,
                          (goal as HabitGoal).targetDays
                        );
                        const progress =
                          ((goal as HabitGoal).completedDays / (goal as HabitGoal).targetDays) * 100;
                        updateGoal(goal.id, {
                          completedDays: updatedCompletedDays,
                          progress: progress,
                        });
                      }}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded"
                    >
                      +1 Day
                    </button>
                    <button
                      onClick={() => {
                        const updatedCompletedDays = Math.max(
                          (goal as HabitGoal).completedDays - 1,
                          0
                        );
                        const progress =
                          ((goal as HabitGoal).completedDays / (goal as HabitGoal).targetDays) * 100;
                        updateGoal(goal.id, {
                          completedDays: updatedCompletedDays,
                          progress: progress,
                        });
                      }}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded"
                    >
                      -1 Day
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
              <div className="relative w-full">
  {/* Background progress bar */}
  <div className="absolute top-1/2 left-0 h-2 w-full bg-gray-200 rounded-full transform -translate-y-1/2" />
  {/* Filled progress */}
  <div
    className="absolute top-1/2 left-0 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"
    style={{ width: `${goal.progress}%` }}
  />
  {/* Range slider */}
  <input
    type="range"
    min="0"
    max="100"
    value={goal.progress}
    onChange={(e) =>
      updateGoal(goal.id, { progress: Number(e.target.value) })
    }
    className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
    style={{
      WebkitAppearance: "none",
      appearance: "none",
      top:"8px",
      height: "0px",
      background: "transparent",
    }}
  />
  <span className="block text-center mt-1">{Math.round(goal.progress)}%</span>
</div>

              </div>
            </div>
          ))}
      </div>
    </div>
  );

  function calculateOverallProgress(keyResults: { text: string; progress: number }[]): number {
    if (!keyResults || keyResults.length === 0) {
      return 0;
    }
    const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
    return totalProgress / keyResults.length;
  }
};

export default GoalTracker;