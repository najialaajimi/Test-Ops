import React from 'react';
import './TaskCard.css';

const statusColors = {
  todo: { bg: '#fff3e0', color: '#f39c12', label: 'To Do' },
  'in-progress': { bg: '#e3f2fd', color: '#3498db', label: 'In Progress' },
  done: { bg: '#e8f5e9', color: '#2ecc71', label: 'Done' },
};

const priorityColors = {
  low: '#95a5a6',
  medium: '#f39c12',
  high: '#e74c3c',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const status = statusColors[task.status] || statusColors.todo;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span
          className="task-status"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.label}
        </span>
        <span
          className="task-priority"
          style={{ color: priorityColors[task.priority] }}
        >
          ● {task.priority}
        </span>
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-footer">
        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <div className="task-actions">
          <button className="btn-action edit" onClick={onEdit}>
            ✏️ Edit
          </button>
          <button className="btn-action delete" onClick={onDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
