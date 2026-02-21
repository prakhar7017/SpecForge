"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import type { GeneratedSpec, UserStory, Task } from "@/lib/validators";

interface TaskEditorProps {
  spec: GeneratedSpec;
  onChange: (spec: GeneratedSpec) => void;
}

export interface TaskEditorRef {
  getCurrentSpec: () => GeneratedSpec;
}

function SortableStory({
  story,
  onUpdate,
  onDelete,
}: {
  story: UserStory;
  onUpdate: (story: UserStory) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: story.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    P0: "bg-red-900/40 text-red-300 border-red-700/50",
    P1: "bg-yellow-900/40 text-yellow-300 border-yellow-700/50",
    P2: "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
  };

  const complexityColors = {
    S: "bg-cyan-900/40 text-cyan-300 border-cyan-700/50",
    M: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    L: "bg-orange-900/40 text-orange-300 border-orange-700/50",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-slate-700/50 rounded-2xl p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg hover:shadow-xl transition-all duration-200 ring-1 ring-slate-700/50"
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-700/50 rounded transition-colors flex-shrink-0 mt-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <div className="flex-1">
          <textarea
            value={story.story}
            onChange={(e) => onUpdate({ ...story, story: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 placeholder:text-slate-500 font-medium text-slate-200"
            rows={2}
            placeholder="User story description..."
          />
        </div>
        <button
          onClick={onDelete}
          className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
          type="button"
          title="Delete story"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={story.priority}
          onChange={(e) =>
            onUpdate({ ...story, priority: e.target.value as "P0" | "P1" | "P2" })
          }
          className={`px-3 py-1.5 border-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${priorityColors[story.priority]} bg-slate-900/50`}
        >
          <option value="P0" className="bg-slate-800">🔴 P0 - Critical</option>
          <option value="P1" className="bg-slate-800">🟡 P1 - Important</option>
          <option value="P2" className="bg-slate-800">🟢 P2 - Nice to Have</option>
        </select>
        <select
          value={story.complexity}
          onChange={(e) =>
            onUpdate({ ...story, complexity: e.target.value as "S" | "M" | "L" })
          }
          className={`px-3 py-1.5 border-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${complexityColors[story.complexity]} bg-slate-900/50`}
        >
          <option value="S" className="bg-slate-800">S - Small (1-3 days)</option>
          <option value="M" className="bg-slate-800">M - Medium (1 week)</option>
          <option value="L" className="bg-slate-800">L - Large (2+ weeks)</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Tasks
        </div>
        {story.tasks.map((task, idx) => (
          <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-700 hover:border-cyan-600/50 transition-all duration-200 ring-1 ring-slate-700/30">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-cyan-500/20">
              {idx + 1}
            </div>
            <input
              type="text"
              value={task.description}
              onChange={(e) => {
                const newTasks = [...story.tasks];
                newTasks[idx] = { ...task, description: e.target.value };
                onUpdate({ ...story, tasks: newTasks });
              }}
              className="flex-1 px-3 py-2 border-2 border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 placeholder:text-slate-500 text-slate-200"
              placeholder="Task description..."
            />
            <button
              onClick={() => {
                const newTasks = story.tasks.filter((t) => t.id !== task.id);
                onUpdate({ ...story, tasks: newTasks });
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
              type="button"
              title="Remove task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newTask: Task = {
              id: `task-${Date.now()}-${Math.random()}`,
              description: "",
            };
            onUpdate({ ...story, tasks: [...story.tasks, newTask] });
          }}
          className="w-full text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 py-2 px-4 rounded-lg border-2 border-dashed border-cyan-600/50 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>
    </div>
  );
}

const TaskEditor = forwardRef<TaskEditorRef, TaskEditorProps>(
  ({ spec, onChange }, ref) => {
    const [localSpec, setLocalSpec] = useState(spec);
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
      setLocalSpec(spec);
    }, [spec]);

    useImperativeHandle(ref, () => ({
      getCurrentSpec: () => localSpec,
    }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localSpec.userStories.findIndex((s) => s.id === active.id);
      const newIndex = localSpec.userStories.findIndex((s) => s.id === over.id);
      const newStories = arrayMove(localSpec.userStories, oldIndex, newIndex);
      updateSpec({ ...localSpec, userStories: newStories });
    }
  };

  const updateSpec = (newSpec: GeneratedSpec) => {
    setLocalSpec(newSpec);

    // Debounced auto-save
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    const timeout = setTimeout(() => {
      onChange(newSpec);
    }, 30000); // 30 seconds
    setSaveTimeout(timeout);
  };

  const handleStoryUpdate = (updatedStory: UserStory) => {
    const newStories = localSpec.userStories.map((s) =>
      s.id === updatedStory.id ? updatedStory : s
    );
    updateSpec({ ...localSpec, userStories: newStories });
  };

  const handleStoryDelete = (storyId: string) => {
    const newStories = localSpec.userStories.filter((s) => s.id !== storyId);
    updateSpec({ ...localSpec, userStories: newStories });
  };

  const handleAddStory = () => {
    const newStory: UserStory = {
      id: `story-${Date.now()}-${Math.random()}`,
      story: "",
      priority: "P1",
      complexity: "M",
      tasks: [],
    };
    updateSpec({ ...localSpec, userStories: [...localSpec.userStories, newStory] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">Edit Tasks</h2>
          <p className="text-sm text-slate-400">Drag to reorder, edit inline, and manage your tasks</p>
        </div>
        <button
          onClick={handleAddStory}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-xl hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 flex items-center gap-2 ring-1 ring-cyan-500/30"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Story Group
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localSpec.userStories.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {localSpec.userStories.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-900/60 rounded-xl border-2 border-dashed border-slate-700 ring-1 ring-slate-700/50">
                <svg className="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-300 font-medium mb-1">No user stories yet</p>
                <p className="text-sm text-slate-500">Click "Add Story Group" to get started</p>
              </div>
            ) : (
              localSpec.userStories.map((story) => (
                <SortableStory
                  key={story.id}
                  story={story}
                  onUpdate={handleStoryUpdate}
                  onDelete={() => handleStoryDelete(story.id)}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
});

TaskEditor.displayName = "TaskEditor";

export default TaskEditor;