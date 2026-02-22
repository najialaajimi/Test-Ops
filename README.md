# 📋 MERN Stack Microservice - Task Manager

A full-stack **Microservice** application built with the **MERN stack** (MongoDB, Express, React, Node.js) featuring user authentication and task management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│                      Port: 3000                      │
└────────────────────┬─────────────────┬──────────────┘
                     │                 │
          ┌──────────▼──────┐   ┌──────▼──────────┐
          │  User Service   │   │  Task Service   │
          │  (Express/Node) │   │  (Express/Node) │
          │   Port: 5001    │   │   Port: 5002    │
          └──────────┬──────┘   └──────┬──────────┘
                     │                 │
          ┌──────────▼─────────────────▼──────────┐
          │              MongoDB                   │
          │   userdb (port 27017)                  │
          │   taskdb (port 27017)                  │
          └────────────────────────────────────────┘
```

## 🚀 Features

- **User Service** (Port 5001)
  - User registration with bcrypt password hashing
  - JWT-based authentication
  - User profile management

- **Task Service** (Port 5002)
  - Full CRUD operations for tasks
  - Task status: `todo`, `in-progress`, `done`
  - Task priority: `low`, `medium`, `high`
  - Protected routes (JWT verification)

- **Frontend** (Port 3000)
  - React with React Router v6
  - Login & Registration pages
  - Dashboard with task statistics
  - Create, edit, delete tasks
  - Filter tasks by status
  - Responsive design

## 📦 Project Structure

```
├── backend/
│   ├── user-service/          # User authentication microservice
│   │   ├── src/
│   │   │   ├── models/        # Mongoose models
│   │   │   ├── routes/        # Express routes
│   │   │   ├── middleware/    # JWT auth middleware
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   └── task-service/          # Task management microservice
│       ├── src/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── middleware/
│       │   └── server.js
│       ├── Dockerfile
│       └── package.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context (Auth)
│   │   ├── pages/             # Page components
│   │   └── services/          # API service layer
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🐳 Run with Docker (Recommended)

```bash
docker-compose up --build
```

Open http://localhost:3000 in your browser.

## 🛠️ Run Locally (Development)

### Prerequisites
- Node.js 18+
- MongoDB running locally

### 1. User Service

```bash
cd backend/user-service
cp .env.example .env
# Edit .env with your settings
npm install
npm run dev
```

### 2. Task Service

```bash
cd backend/task-service
cp .env.example .env
# Edit .env with your settings
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

## 🔌 API Endpoints

### User Service (Port 5001)

| Method | Endpoint               | Description          | Auth |
|--------|------------------------|----------------------|------|
| GET    | /health                | Health check         | No   |
| POST   | /api/users/register    | Register user        | No   |
| POST   | /api/users/login       | Login & get token    | No   |
| GET    | /api/users/profile     | Get user profile     | Yes  |

### Task Service (Port 5002)

| Method | Endpoint               | Description          | Auth |
|--------|------------------------|----------------------|------|
| GET    | /health                | Health check         | No   |
| GET    | /api/tasks             | Get all user tasks   | Yes  |
| POST   | /api/tasks             | Create a task        | Yes  |
| PUT    | /api/tasks/:id         | Update a task        | Yes  |
| DELETE | /api/tasks/:id         | Delete a task        | Yes  |

## 🔒 Environment Variables

Copy `.env.example` to `.env` in each service directory:

| Variable     | Description                    | Default                        |
|--------------|--------------------------------|--------------------------------|
| PORT         | Service port                   | 5001 / 5002                    |
| MONGO_URI    | MongoDB connection string      | mongodb://localhost:27017/...  |
| JWT_SECRET   | JWT signing secret             | (required - change in prod!)   |
| NODE_ENV     | Environment                    | development                    |

## 🧪 Running Tests

```bash
# User Service tests
cd backend/user-service && npm test

# Task Service tests
cd backend/task-service && npm test
```
