type TaskType = {
  title: string;
  description: string;
  done: boolean;
};

type TaskProps = {
  tasks: TaskType[];
  toggleDone: (index: number) => void;
  removeTask: (index: number) => void;
};

export default function Task({ tasks, toggleDone, removeTask }: TaskProps) {
  return tasks.map((task, index) => (
    <li
      key={index}
      className="flex flex-col gap-2 mb-2 bg-zinc-100 p-5 rounded shadow-lg"
    >
      <div className="flex justify-between items-center flex-wrap">
        <span
          className={`font-bold text-lg sm:text-2xl break-words w-full flex-1 min-w-0 capitalize ${
            task.done ? "text-zinc-300 text-shadow-zinc-900" : ""
          }`}
        >
          {task.title}
        </span>
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
      <div className="flex items-center min-w-0">
        <span
          className={`break-words w-full min-w-0 text-sm sm:text-base ml-2 italic ${
            task.done ? "text-zinc-300 text-shadow-zinc-900" : ""
          }`}
        >
          {task.description}
        </span>
      </div>
    </li>
  ));
}
