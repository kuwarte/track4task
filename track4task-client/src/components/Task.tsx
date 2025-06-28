import { useState } from "react";

type TaskType = {
  title: string;
  description: string;
  done: boolean;
};

type TaskProps = {
  tasks: TaskType[];
  toggleDone: (index: number) => void;
  removeTask: (index: number) => void;
  editTask: (
    index: number,
    field: "title" | "description",
    newValue: string
  ) => void;
};

export default function Task({
  tasks,
  toggleDone,
  removeTask,
  editTask,
}: TaskProps) {
  const [editingIndex, setTaskEditingIndex] = useState<number | null>(null);
  const [editingField, setTaskEditingField] = useState<
    "title" | "description" | null
  >(null);
  const [editValue, setTaskEditValue] = useState<string>("");

  const handleDoubleClick = (index: number, field: "title" | "description") => {
    setTaskEditingIndex(index);
    setTaskEditingField(field);
    setTaskEditValue(tasks[index][field]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.split(/\s+/).some((word) => word.length > 15)) return;
    setTaskEditValue(value);
  };

  const handleSave = () => {
    if (editingIndex !== null && editingField !== null) {
      const trimmedValue = editValue.trim();
      const finalValue =
        trimmedValue === "" && editingField === "description"
          ? "No description provided"
          : trimmedValue;

      if (finalValue !== "") {
        editTask(editingIndex, editingField, finalValue);
      }
    }
    setTaskEditingIndex(null);
    setTaskEditingField(null);
    setTaskEditValue("");
  };

  return tasks.map((task, index) => (
    <li
      key={index}
      className="flex flex-col gap-2 mb-2 bg-zinc-100 p-3 sm:p-5 rounded shadow-lg"
    >
      <div className="flex justify-between items-center flex-wrap">
        {editingIndex === index && editingField === "title" ? (
          <input
            type="text"
            value={editValue}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            maxLength={30}
            autoFocus
            className="font-bold text-lg sm:text-2xl break-words w-full flex-1 min-w-0 p-1 rounded shadow"
          />
        ) : (
          <span
            onDoubleClick={() => handleDoubleClick(index, "title")}
            className={`font-bold text-lg sm:text-2xl break-words w-full flex-1 min-w-0 capitalize cursor-pointer ${
              task.done ? "text-zinc-300 text-shadow-zinc-900" : ""
            }`}
          >
            {task.title}
          </span>
        )}

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            onClick={() => toggleDone(index)}
            className={`flex justify-center items-center h-6 w-30 px-2 py-1 rounded drop-shadow-lg cursor-pointer ${
              task.done ? "bg-emerald-500 text-white" : "bg-zinc-600 text-white"
            }`}
          >
            {task.done ? "Completed" : "Mark as Done"}
          </button>
          <button
            onClick={() => removeTask(index)}
            className="flex justify-center items-center h-6 w-6 bg-zinc-600 text-white px-2 py-1 rounded hover:bg-red-600 transition-all duration-200 cursor-pointer drop-shadow-lg active:bg-red-900"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="w-full">
        {editingIndex === index && editingField === "description" ? (
          <input
            type="text"
            value={editValue}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            maxLength={120}
            autoFocus
            className="text-sm sm:text-base ml-2 italic w-full p-1 rounded shadow"
          />
        ) : (
          <span
            onDoubleClick={() => handleDoubleClick(index, "description")}
            className={`break-words w-full min-w-0 text-sm sm:text-base ml-2 italic cursor-pointer ${
              task.done ? "text-zinc-300 text-shadow-zinc-900" : ""
            }`}
          >
            {task.description}
          </span>
        )}
      </div>
    </li>
  ));
}
