#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Restaurant Project Docker Setup ===${NC}\n"

# Get the main project directory (parent of script location)
MAIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$MAIN_DIR/restaurant-backend"
FRONTEND_DIR="$MAIN_DIR/smart-restaurant"

echo -e "${YELLOW}Main Directory: $MAIN_DIR${NC}"
echo -e "${YELLOW}Backend Directory: $BACKEND_DIR${NC}"
echo -e "${YELLOW}Frontend Directory: $FRONTEND_DIR${NC}\n"

# ============================================
# BACKEND SETUP
# ============================================

echo -e "${GREEN}[1/6] Setting up Backend...${NC}"

cd "$BACKEND_DIR" || exit 1

# Generate requirements.txt from virtual environment
echo -e "${YELLOW}Generating requirements.txt...${NC}"
if [ -d "$MAIN_DIR/venv" ]; then
    source "$MAIN_DIR/venv/bin/activate"
    pip freeze > requirements.txt
    deactivate
    echo -e "${GREEN}✓ requirements.txt created${NC}"
else
    echo -e "${RED}✗ Virtual environment not found, using existing requirements.txt${NC}"
fi

# Create Dockerfile for Backend
echo -e "${YELLOW}Creating Backend Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
EOF
echo -e "${GREEN}✓ Backend Dockerfile created${NC}"

# Create .dockerignore for Backend
echo -e "${YELLOW}Creating Backend .dockerignore...${NC}"
cat > .dockerignore << 'EOF'
__pycache__
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
.dockerignore
Dockerfile
docker-compose.yml
.git
.gitignore
.vscode
.idea
*.swp
*.swo
.env
tests/
*.db
*.sqlite3
README.md
docs/
EOF
echo -e "${GREEN}✓ Backend .dockerignore created${NC}"

# ============================================
# FRONTEND SETUP
# ============================================

echo -e "\n${GREEN}[2/6] Setting up Frontend...${NC}"

cd "$FRONTEND_DIR" || exit 1

# Create Dockerfile for Frontend
echo -e "${YELLOW}Creating Frontend Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
echo -e "${GREEN}✓ Frontend Dockerfile created${NC}"

# Create nginx.conf for Frontend
echo -e "${YELLOW}Creating nginx.conf...${NC}"
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
EOF
echo -e "${GREEN}✓ nginx.conf created${NC}"

# Create .dockerignore for Frontend
echo -e "${YELLOW}Creating Frontend .dockerignore...${NC}"
cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.DS_Store
.vscode
.idea
build
coverage
EOF
echo -e "${GREEN}✓ Frontend .dockerignore created${NC}"

# ============================================
# DOCKER COMPOSE SETUP
# ============================================

echo -e "\n${GREEN}[3/6] Creating Docker Compose configuration...${NC}"

cd "$MAIN_DIR" || exit 1

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: restaurant_db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-restaurant_db}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - restaurant_network

  backend:
    build: ./restaurant-backend
    container_name: restaurant_backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-restaurant_db}
    env_file:
      - ./restaurant-backend/.env
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./restaurant-backend:/app
      - /app/__pycache__
    networks:
      - restaurant_network

  frontend:
    build: ./smart-restaurant
    container_name: restaurant_frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - restaurant_network

volumes:
  postgres_data:

networks:
  restaurant_network:
    driver: bridge
EOF
echo -e "${GREEN}✓ docker-compose.yml created${NC}"

# ============================================
# ENVIRONMENT FILE
# ============================================

echo -e "\n${GREEN}[4/6] Creating environment file...${NC}"

if [ ! -f "$BACKEND_DIR/.env" ]; then
    cat > "$BACKEND_DIR/.env" << 'EOF'
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=restaurant_db

# Application Configuration
SECRET_KEY=your-secret-key-change-this-in-production
DEBUG=True
DATABASE_URL=postgresql://postgres:postgres@db:5432/restaurant_db
EOF
    echo -e "${GREEN}✓ .env file created in backend${NC}"
else
    echo -e "${YELLOW}✓ .env file already exists${NC}"
fi

# ============================================
# README FILE
# ============================================

echo -e "\n${GREEN}[5/6] Creating README...${NC}"

cat > "$MAIN_DIR/README-DOCKER.md" << 'EOF'
# Restaurant Project - Docker Setup

## Prerequisites
- Docker
- Docker Compose

## Quick Start

### 1. Start everything
```bash
docker-compose up --build
```

### 2. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: localhost:5432

## Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild after changes
```bash
docker-compose up --build
```

### Fresh start (removes data)
```bash
docker-compose down -v
docker-compose up --build
```

### Run backend seeds
```bash
docker-compose exec backend python seed_data.py
```

### Access database
```bash
docker-compose exec db psql -U postgres -d restaurant_db
```

## Project Structure
```
.
├── restaurant-backend/      # FastAPI backend
│   ├── Dockerfile
│   └── .env
├── smart-restaurant/        # React frontend
│   └── Dockerfile
└── docker-compose.yml       # Orchestration
```

## Notes
- Database data persists in Docker volume
- Backend has hot-reload enabled
- Frontend uses nginx for production serving
EOF
echo -e "${GREEN}✓ README-DOCKER.md created${NC}"

# ============================================
# SUMMARY
# ============================================

echo -e "\n${GREEN}[6/6] Setup Complete!${NC}\n"

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Docker Setup Complete! 🎉${NC}"
echo -e "${GREEN}================================================${NC}\n"

echo -e "${YELLOW}Files created:${NC}"
echo -e "  ✓ restaurant-backend/Dockerfile"
echo -e "  ✓ restaurant-backend/.dockerignore"
echo -e "  ✓ restaurant-backend/requirements.txt"
echo -e "  ✓ restaurant-backend/.env"
echo -e "  ✓ smart-restaurant/Dockerfile"
echo -e "  ✓ smart-restaurant/.dockerignore"
echo -e "  ✓ smart-restaurant/nginx.conf"
echo -e "  ✓ docker-compose.yml"
echo -e "  ✓ README-DOCKER.md\n"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review .env file in restaurant-backend/"
echo -e "  2. Run: ${GREEN}docker-compose up --build${NC}"
echo -e "  3. Access frontend at: ${GREEN}http://localhost:3000${NC}"
echo -e "  4. Access backend at: ${GREEN}http://localhost:8000${NC}\n"

echo -e "${YELLOW}To start now, run:${NC}"
echo -e "  ${GREEN}cd $MAIN_DIR${NC}"
echo -e "  ${GREEN}docker-compose up --build${NC}\n"
