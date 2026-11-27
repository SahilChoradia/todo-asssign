import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskApi, TaskStatus } from "../api";

export default function AddTask() {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("Incomplete");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function onFormSubmit(e: FormEvent) {
    e.preventDefault();
    if (!taskName.trim()) {
      setFormError("Please enter a task name.");
      return;
    }

    setIsSaving(true);
    try {
      await taskApi.create(taskName, taskStatus);
      navigate("/");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save task.");
      setIsSaving(false);
    }
  }

  return (
    <form className="card task-form" onSubmit={onFormSubmit}>
      <h2>Add a task</h2>
      <label>
        Task name
        <input
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            setFormError("");
          }}
          maxLength={200}
          placeholder="Enter a task..."
          autoFocus
        />
      </label>
      <label>
        Status
        <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}>
          <option>Incomplete</option>
          <option>Complete</option>
        </select>
      </label>
      {formError && (
        <p className="error-banner" role="alert">
          {formError}
        </p>
      )}
      <button className="btn-primary" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save task"}
      </button>
    </form>
  );
}
