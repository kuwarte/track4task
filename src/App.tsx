import { useState } from "react";

type Task = {
  text: string;
  done: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const doneTaskCount: number = tasks.filter((task) => task.done).length;
  const todoTaskCount: number = tasks.length - doneTaskCount;

  const addTask: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, done: false }]);
    setNewTask("");
  };

  const removeTask: (index: number) => void = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleDone = (index: number) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-zinc-200">
        <h1 className="text-2xl font-bold mb-4 text-left bg-gradient-to-r from-amber-950 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
          taskTracker
        </h1>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task [ 25 characters max ]"
          className="bg-zinc-100 p-2 rounded w-full mb-4 shadow-lg focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all duration-200"
          maxLength={25}
        />
        <button
          onClick={addTask}
          disabled={tasks.length >= 3}
          className="bg-zinc-600 text-white px-4 py-2 rounded w-full hover:bg-zinc-800 transition-all duration-200 cursor-pointer focus:bg-zinc-900 shadow-lg disabled:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Task
        </button>
        <hr className="my-7 border-1 border-dashed" />
        {tasks.length > 1 ? (
          <h2 className="text-xl font-bold mb-4 text-left bg-gradient-to-r from-amber-950 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
            tasksList
          </h2>
        ) : (
          <h2 className="text-xl font-bold mb-4 text-left bg-gradient-to-r from-amber-950 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
            taskList
          </h2>
        )}
        <p className="italic text-zinc-500">
          Tap the ellipsis if done (...), 3 tasks is the maximum
        </p>
        <ul className="mt-4">
          {tasks.length === 0 ? (
            <li className="text-center text-zinc-500">No tasks yet</li>
          ) : (
            tasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 bg-zinc-100 p-3 rounded shadow-lg"
              >
                <span className={task.done ? "line-through text-zinc-400" : ""}>
                  {task.text}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDone(index)}
                    className={`px-2 py-1 rounded h-8 w-8 drop-shadow-lg cursor-pointer ${
                      task.done
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-600 text-white"
                    }`}
                  >
                    {task.done ? "✓" : "…"}
                  </button>
                  <button
                    onClick={() => removeTask(index)}
                    className="h-8 w-8 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800 transition-all duration-200  cursor-pointer drop-shadow-lg"
                  >
                    ✗
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="flex flex-col absolute top-3 left-3">
        <span className="italic">Done Tasks: {doneTaskCount}</span>
        <span className="italic">Task To Do: {todoTaskCount}</span>
      </div>
    </div>
  );
}
