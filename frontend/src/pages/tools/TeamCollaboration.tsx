import { useState } from 'react';


type Task = {
  id: string;
  title: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'Researcher';
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
};

export default function SoloTeamDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    role: 'Developer',
    priority: 'medium'
  });

  const roles = ['Developer', 'Designer', 'Manager', 'Researcher'];
  const roleColors = {
    Developer: 'bg-blue-100 text-blue-800',
    Designer: 'bg-pink-100 text-pink-800',
    Manager: 'bg-green-100 text-green-800',
    Researcher: 'bg-purple-100 text-purple-800'
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Math.random().toString(),
        title: newTask,
        role: currentTask.role!,
        status: 'todo',
        priority: currentTask.priority!,
        dueDate: currentTask.dueDate
      }]);
      setNewTask('');
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const filteredTasks = tasks.filter(task => 
    selectedRole === 'all' || task.role === selectedRole
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Solo Team Dashboard</h1>
          <p className="text-gray-600">Manage different work roles and responsibilities</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {roles.map(role => (
          <div key={role} className={`p-4 rounded-lg ${roleColors[role as keyof typeof roleColors]}`}>
            <div className="font-bold">{role}</div>
            <div className="text-2xl">
              {tasks.filter(t => t.role === role).length}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            className="flex-1 p-2 border rounded-lg"
          />
          
          <select 
            value={currentTask.role}
            onChange={(e) => setCurrentTask({...currentTask, role: e.target.value as Task['role']})}
            className="p-2 border rounded-lg"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={currentTask.priority}
            onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value as Task['priority']})}
            className="p-2 border rounded-lg"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="date"
            onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})}
            className="p-2 border rounded-lg"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedRole('all')}
          className={`px-4 py-2 rounded-lg ${selectedRole === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All Roles
        </button>
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-lg ${selectedRole === role ? roleColors[role as keyof typeof roleColors] : 'bg-gray-200'}`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-3 gap-4">
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} className="bg-gray-50 p-4 rounded-lg">
            <div className="font-bold mb-4 text-gray-600">
              {status.replace('-', ' ').toUpperCase()}
            </div>
            
            {filteredTasks
              .filter(task => task.status === status)
              .map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${roleColors[task.role]}`}>
                      {task.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {task.priority}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {status !== 'todo' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'todo')}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                      >
                        Mark Todo
                      </button>
                    )}
                    {status !== 'in-progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className="text-xs bg-yellow-100 px-2 py-1 rounded"
                      >
                        Start Progress
                      </button>
                    )}
                    {status !== 'done' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'done')}
                        className="text-xs bg-green-100 px-2 py-1 rounded"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}