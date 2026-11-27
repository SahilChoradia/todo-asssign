import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Task, TaskStatus } from "../api";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "../components/TaskItem";

type FilterOption = "All" | TaskStatus;
type SortOption = "newest" | "name" | "status";

function filterAndSortTasks(
  list: Task[],
  searchQuery: string,
  statusFilter: FilterOption,
  sortBy: SortOption
): Task[] {
  const searchTerm = searchQuery.trim().toLowerCase();

  return list
    .filter(
      (item) =>
        (statusFilter === "All" || item.status === statusFilter) &&
        item.name.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "status") {
        return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
}

export default function Home() {
  const { tasks, isLoading, errorMsg, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterOption>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, searchQuery, statusFilter, sortBy),
    [tasks, searchQuery, statusFilter, sortBy]
  );
  const completedCount = tasks.filter((item) => item.status === "Complete").length;

  const handleToggleStatus = (item: Task) =>
    updateTask(item.id, { status: item.status === "Complete" ? "Incomplete" : "Complete" });

  return (
    <section>
      <div className="top-bar">
        <p>{tasks.length ? `${completedCount} of ${tasks.length} complete` : "No tasks yet"}</p>
        <Link className="btn-primary" to="/add">
          Add task
        </Link>
      </div>

      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search tasks"
          aria-label="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterOption)}
        >
          <option value="All">All statuses</option>
          <option>Incomplete</option>
          <option>Complete</option>
        </select>
        <select
          aria-label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="newest">Newest first</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
        </select>
      </div>

      {errorMsg && (
        <p className="error-banner" role="alert">
          {errorMsg}
        </p>
      )}
      {isLoading && <p className="empty-msg">Loading tasks...</p>}

      {!isLoading && filteredTasks.length === 0 && (
        <p className="empty-msg">
          {tasks.length === 0 ? (
            <>
              No tasks added yet. <Link to="/add">Add your first task</Link>.
            </>
          ) : (
            "No matching tasks found."
          )}
        </p>
      )}

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleStatus={handleToggleStatus}
            onSaveName={(item, newName) => updateTask(item.id, { name: newName })}
            onRemove={(item) => deleteTask(item.id)}
          />
        ))}
      </ul>
    </section>
  );
}
