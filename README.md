# MERN Stack Microservices Application

A full-stack microservices application built with the MERN stack (MongoDB, Express, React, Node.js), featuring API Gateway, monitoring, CI/CD, and container orchestration.

## Architecture

```
                    ┌─────────────┐
                    │   Frontend  │  (React)
                    │   Port: 80  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Gateway   │  (API Gateway)
                    │  Port: 3000 │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │User Service │ │Cat. Service │ │Prod.Service │
    │ Port: 3001  │ │ Port: 3002  │ │ Port: 3003  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           └───────────────┼───────────────┘
                    ┌──────▼──────┐
                    │   MongoDB   │
                    │ Port: 27017 │
                    └─────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React SPA with Users, Categories, Products management |
| Gateway | 3000 | API Gateway / reverse proxy to backend services |
| User Service | 3001 | User CRUD + JWT Authentication |
| Category Service | 3002 | Category CRUD |
| Product Service | 3003 | Product CRUD with category filter |
| MongoDB | 27017 | Shared database instance |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3004 | Metrics visualization |
| Node Exporter | 9100 | Host metrics |

## Technologies

- **Backend**: Node.js, Express.js, Mongoose
- **Frontend**: React 18, React Router, Axios
- **Database**: MongoDB 6.0
- **Gateway**: http-proxy-middleware
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Monitoring**: Prometheus, Grafana, Node Exporter, prom-client
- **Testing**: Jest, jest-junit, Supertest, mongodb-memory-server
- **Code Quality**: SonarQube
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitLab CI/CD
- **Registry**: GitLab Container Registry

## Quick Start (Docker Compose)

```bash
# Clone the repository
git clone <repo-url>
cd Test-Ops

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access Points:**
- Frontend: http://localhost
- API Gateway: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3004 (admin/admin)

## Running Tests

```bash
# Test User Service
cd backend/user-service && npm ci && npm test

# Test Category Service
cd backend/category-service && npm ci && npm test

# Test Product Service
cd backend/product-service && npm ci && npm test

# Test Gateway Service
cd backend/gateway-service && npm ci && npm test
```

## API Endpoints

### Users (via Gateway: /api/users)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/users/register | Register a new user |
| POST | /api/users/login | Login and get JWT token |
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Categories (via Gateway: /api/categories)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/categories | Get all categories |
| GET | /api/categories/:id | Get category by ID |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

### Products (via Gateway: /api/products)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/products | Get all products (supports ?categoryId filter) |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

## Kubernetes Deployment

```bash
# Create namespace and deploy
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/mongodb.yaml
kubectl apply -f kubernetes/user-service.yaml
kubectl apply -f kubernetes/category-service.yaml
kubectl apply -f kubernetes/product-service.yaml
kubectl apply -f kubernetes/gateway-service.yaml
kubectl apply -f kubernetes/frontend.yaml
kubectl apply -f kubernetes/monitoring/

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-jwt-secret \
  --from-literal=grafana-password=your-grafana-password \
  -n mern-app
```

## GitLab CI/CD Variables

Configure these variables in GitLab Settings > CI/CD > Variables:

| Variable | Description |
|----------|-------------|
| `SONAR_HOST_URL` | SonarQube server URL |
| `SONAR_TOKEN` | SonarQube authentication token |
| `KUBE_CONFIG` | Base64-encoded kubeconfig for staging |
| `KUBE_CONFIG_PROD` | Base64-encoded kubeconfig for production |
| `REACT_APP_GATEWAY_URL` | Public URL of the API gateway |

## Monitoring

- **Prometheus** scrapes metrics from all services via `/metrics` endpoint
- **Grafana** visualizes metrics with Prometheus as datasource
- **Node Exporter** provides host-level system metrics
- All services expose `http_request_duration_seconds` histogram metric