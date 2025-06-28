import { useState, useEffect } from "react";
import axios from "axios";
import Task from "./components/Task";
import SearchIcon from "./components/icons/SearchIcon";

type Task = {
  title: string;
  description: string;
  done: boolean;
  id?: string;
  _id?: string;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [searchTask, setSearchTask] = useState<string>("");

  const doneTaskCount = tasks.filter((task) => task.done).length;
  const todoTaskCount = tasks.length - doneTaskCount;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    document.title = `track4task - ${todoTaskCount} ${
      todoTaskCount <= 1 ? "task" : "tasks"
    } left`;
  }, [todoTaskCount]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTitle.trim() === "" || tasks.length >= 10) return;
    const newTask = {
      title: newTitle,
      description:
        newDescription.trim() === ""
          ? "No description provided"
          : newDescription,
      done: false,
    };
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask);
      await fetchTasks();
      setNewTitle("");
      setNewDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const removeTask = async (index: number) => {
    const taskId = tasks[index]._id || tasks[index].id;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDone = async (index: number) => {
    const task = tasks[index];
    const taskId = task._id || task.id;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        ...task,
        done: !task.done,
      });
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const editTask = async (
    index: number,
    field: "title" | "description",
    newValue: string
  ) => {
    const task = tasks[index];
    const taskId = task._id || task.id;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        ...task,
        [field]: newValue,
      });
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTitleWordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.split(/\s+/).some((word) => word.length > 15)) return;
    setNewTitle(value);
  };

  const handleDescriptionWordInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value.split(/\s+/).some((word) => word.length > 15)) return;
    setNewDescription(value);
  };

  const filteredTasks = tasks.filter((task) =>
    (task.title + " " + task.description)
      .toLowerCase()
      .includes(searchTask.toLowerCase())
  );

  return (
    <div className="h-screen px-2 flex items-center justify-center bg-zinc-100">
      <div className="w-250 h-150 p-8 rounded-lg shadow-lg bg-zinc-200 flex flex-col">
        <h1 className="text-5xl font-bold text-left text-zinc-700 text-shadow-lg">
          track4task
        </h1>
        <p className="text-xl font-mono mb-4 text-zinc-500 align-middle ml-2">
          personalTrackerForTasks
        </p>
        <form onSubmit={handleAddTask} className="h-30 flex justify-between">
          <div className="flex flex-col w-[90%] h-full gap-2 items-center">
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleWordInput}
              placeholder={
                tasks.length >= 10
                  ? "Remove task first to add new..."
                  : "Add task title [30 characters max]"
              }
              className="bg-zinc-100 p-2 rounded w-full shadow-lg focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all duration-200"
              maxLength={30}
              autoFocus
            />
            <input
              disabled={newTitle.length < 1}
              value={newDescription}
              onChange={handleDescriptionWordInput}
              placeholder="Add task description [120 characters max]"
              className={`bg-zinc-100 p-2 rounded w-full shadow-lg focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all duration-200 ${
                newTitle.length >= 1 ? "opacity-100" : "opacity-40"
              }`}
              maxLength={120}
            />
          </div>
          <button
            type="submit"
            disabled={tasks.length >= 10}
            className="flex justify-center items-center w-[9%] h-full bg-zinc-600 text-white text-2xl rounded hover:bg-zinc-700 transition-all duration-200 cursor-pointer focus:bg-zinc-900 shadow-lg disabled:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            +
          </button>
        </form>
        <hr className="my-7 border-1 border-dashed" />
        <div className="flex items-center justify-between mb-4">
          {tasks.length > 1 ? (
            <h2 className="text-4xl font-bold mb-4 text-left text-zinc-700 text-shadow-lg">
              taskslist
            </h2>
          ) : (
            <h2 className="text-4xl font-bold mb-4 text-left text-zinc-700 text-shadow-lg">
              tasklist
            </h2>
          )}
          <div className="relative w-[40%]">
            <input
              type="text"
              value={searchTask}
              onChange={(e) => setSearchTask(e.target.value)}
              placeholder={
                tasks.length <= 1
                  ? "There is no task to filter..."
                  : "Filter tasks..."
              }
              disabled={tasks.length <= 1}
              className={`bg-zinc-100 p-2 pr-10 rounded w-full shadow-lg focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all duration-200 ${
                tasks.length <= 1 ? "opacity-40" : "opacity-100"
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none select-none">
              <SearchIcon />
            </span>
          </div>
        </div>
        <p className="italic text-zinc-500 mt-[-20px]">
          Click "mark as done" if completed. A maximum of 10 tasks is allowed.
          Double click the task to edit.
        </p>
        <ul className="bg-zinc-300 mt-4 p-4 h-55 max-h-55 rounded shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] overflow-y-scroll">
          {tasks.length === 0 ? (
            <li className="text-center text-zinc-500">No tasks yet</li>
          ) : (
            <Task
              tasks={filteredTasks}
              toggleDone={toggleDone}
              removeTask={removeTask}
              editTask={editTask}
            />
          )}
        </ul>
        <div className="self-end gap-2 mt-4 flex items-center justify-end">
          <span className="italic text-zinc-500">
            Done Tasks: {doneTaskCount}
          </span>
          <span className="italic text-zinc-500">
            Task To Do: {todoTaskCount}
          </span>
        </div>
      </div>
    </div>
  );
}
