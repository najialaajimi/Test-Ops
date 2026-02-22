import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updated = await taskService.updateTask(id, taskData);
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content container">
        <div className="dashboard-header">
          <div>
            <h2>Welcome back, {user?.name}! 👋</h2>
            <p>Here&apos;s your task overview</p>
          </div>
          <button className="btn btn-add" onClick={() => { setShowForm(true); setEditingTask(null); }}>
            + New Task
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card todo">
            <span className="stat-number">{stats.todo}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="stat-card in-progress">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card done">
            <span className="stat-number">{stats.done}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
          />
        )}

        <div className="filter-bar">
          {['all', 'todo', 'in-progress', 'done'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>🗒️ No tasks found.</p>
            <p>Click &quot;New Task&quot; to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => { setEditingTask(task); setShowForm(false); }}
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
