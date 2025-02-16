import { useState, useEffect } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createEvents } from 'ics';

interface TimeBlock {
  id: string;
  task: string;
  category: string;
  duration: number;
}

type TimeBlockWithTime = TimeBlock & {
  startTime: Date;
  endTime: Date;
  timeString: string;
};

const categories = [
  { name: 'Work', color: 'bg-blue-100' },
  { name: 'Personal', color: 'bg-green-100' },
  { name: 'Exercise', color: 'bg-red-100' },
  { name: 'Meeting', color: 'bg-yellow-100' },
];

const SortableItem = ({ block, handleTaskChange }: { 
  block: TimeBlockWithTime;
  handleTaskChange: (id: string, field: string, value: string | number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg transition-all mb-2 ${
        categories.find(c => c.name === block.category)?.color || 'bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <button {...attributes} {...listeners} className="cursor-move">⠿</button>
        <div className="w-48 flex-shrink-0 font-medium">
          {block.timeString}
        </div>
        <select
          value={block.category}
          onChange={(e) => handleTaskChange(block.id, 'category', e.target.value)}
          className="px-2 py-1 border rounded-md"
        >
          <option value="">Category</option>
          {categories.map(category => (
            <option key={category.name} value={category.name}>{category.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={block.task}
          onChange={(e) => handleTaskChange(block.id, 'task', e.target.value)}
          placeholder="What's your plan?"
          className="flex-grow px-4 py-2 border rounded-md"
        />
        <select
          value={block.duration}
          onChange={(e) => handleTaskChange(block.id, 'duration', Number(e.target.value))}
          className="px-2 py-1 border rounded-md"
        >
          {[0.25, 0.5, 0.75, 1, 1.5, 2].map(d => (
            <option key={d} value={d}>{(d * 60)}min</option>
          ))}
        </select>
        <button
          onClick={() => handleTaskChange(block.id, 'task', '')}
          className="text-red-500 hover:text-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const TimeBlockPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('timeBlocks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (timeBlocks.length === 0) {
      const blocks = Array.from({ length: 52 }, (_, i) => ({
        id: `block-${i}`,
        task: '',
        category: '',
        duration: 0.25,
      }));
      setTimeBlocks(blocks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeBlocks', JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  const computedBlocks = computeTimes(timeBlocks, selectedDate);

  function computeTimes(blocks: TimeBlock[], date: Date): TimeBlockWithTime[] {
    let currentTime = new Date(date);
    currentTime.setHours(8, 0, 0, 0);
    
    return blocks.map(block => {
      const startTime = new Date(currentTime);
      const durationMs = block.duration * 60 * 60 * 1000;
      const endTime = new Date(startTime.getTime() + durationMs);
      
      const timeString = `${startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - 
                        ${endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      
      currentTime = new Date(endTime);
      return { ...block, startTime, endTime, timeString };
    });
  }

  const handleTaskChange = (id: string, field: string, value: string | number) => {
    setTimeBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTimeBlocks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleClearAll = () => {
    setTimeBlocks(prev => prev.map(block => ({ ...block, task: '', category: '' })));
  };

  const exportToCalendar = () => {
    const events = computedBlocks
      .filter(block => block.task)
      .map(block => {
        const start = block.startTime;
        const end = block.endTime;
        return {
          title: block.task,
          description: `Category: ${block.category}`,
          start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
          end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
        };
      });

    createEvents(events, (error, value) => {
      if (error) {
        console.error('Error creating calendar events:', error);
        return;
      }
      
      const blob = new Blob([value], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schedule-${selectedDate.toISOString().split('T')[0]}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Daily Time Block Planner</h1>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        <DndContext 
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={computedBlocks}
            strategy={verticalListSortingStrategy}
          >
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              {computedBlocks.map(block => (
                <SortableItem 
                  key={block.id} 
                  block={block}
                  handleTaskChange={handleTaskChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={handleClearAll}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Clear All
          </button>
          <button
            onClick={exportToCalendar}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Export to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeBlockPlanner;