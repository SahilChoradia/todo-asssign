import { FormEvent, useState } from "react";
import { Task } from "../api";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onSaveName: (task: Task, newName: string) => Promise<boolean>;
  onRemove: (task: Task) => void;
}

export default function TaskItem({ task, onToggleStatus, onSaveName, onRemove }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const isDone = task.status === "Complete";

  function openEditMode() {
    setEditedName(task.name);
    setIsEditing(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const ok = await onSaveName(task, editedName);
    if (ok) setIsEditing(false);
  }

  return (
    <li className={isDone ? "done-row" : undefined}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggleStatus(task)}
        aria-label={`Mark "${task.name}" as ${isDone ? "incomplete" : "complete"}`}
      />

      {isEditing ? (
        <form className="inline-edit-form" onSubmit={handleSave}>
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            maxLength={200}
            autoFocus
          />
          <button className="btn-primary">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span className="task-title">{task.name}</span>
          <span className={isDone ? "status-pill done" : "status-pill pending"}>
            {task.status}
          </span>
          <span className="row-actions">
            <button onClick={openEditMode}>Edit</button>
            <button className="btn-danger" onClick={() => onRemove(task)}>
              Delete
            </button>
          </span>
        </>
      )}
    </li>
  );
}
