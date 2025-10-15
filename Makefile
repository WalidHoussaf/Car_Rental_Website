# Car Rental Website - Docker Commands
# Simplifies common Docker operations

.PHONY: help build up down restart logs clean dev prod

# Default target
help:
	@echo "Car Rental Website - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  help        Show this help message"
	@echo "  build       Build all Docker images"
	@echo "  up          Start all services (production)"
	@echo "  down        Stop all services"
	@echo "  restart     Restart all services"
	@echo "  logs        View logs from all services"
	@echo "  clean       Remove all containers, volumes, and images"
	@echo "  dev         Start in development mode"
	@echo "  prod        Start in production mode"
	@echo "  status      Show status of all services"
	@echo "  shell-backend   Open shell in backend container"
	@echo "  shell-frontend  Open shell in frontend container"
	@echo "  shell-db        Open MongoDB shell"
	@echo "  backup      Backup MongoDB database"
	@echo "  test        Run backend tests"
	@echo ""

# Build all images
build:
	docker-compose build

# Build without cache
build-clean:
	docker-compose build --no-cache

# Start production environment
up:
	docker-compose --env-file .env.docker up -d

# Start production with logs
up-logs:
	docker-compose --env-file .env.docker up

# Start development environment
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.docker up

# Start development in background
dev-bg:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.docker up -d

# Start production environment
prod:
	docker-compose --env-file .env.docker up -d

# Stop all services
down:
	docker-compose down

# Stop and remove volumes (WARNING: deletes data)
down-volumes:
	docker-compose down -v

# Restart all services
restart:
	docker-compose restart

# Restart specific service (usage: make restart-backend)
restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

restart-db:
	docker-compose restart mongodb

# View logs
logs:
	docker-compose logs -f

# View logs for specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f mongodb

# Show service status
status:
	docker-compose ps

# Open shell in backend container
shell-backend:
	docker-compose exec backend sh

# Open shell in frontend container
shell-frontend:
	docker-compose exec frontend sh

# Open MongoDB shell
shell-db:
	docker-compose exec mongodb mongosh -u admin -p changeme --authenticationDatabase admin

# Run backend tests
test:
	docker-compose exec backend npm test

# Run backend tests with coverage
test-coverage:
	docker-compose exec backend npm run test:coverage

# Seed database with users
seed-users:
	docker-compose exec backend npm run seed:users

# Reset users
reset-users:
	docker-compose exec backend npm run reset:users

# Backup MongoDB
backup:
	@echo "Creating MongoDB backup..."
	docker-compose exec mongodb mongodump --username admin --password changeme --authenticationDatabase admin --out /data/backup
	docker cp car-rental-mongodb:/data/backup ./mongodb-backup-$(shell date +%Y%m%d-%H%M%S)
	@echo "Backup created in ./mongodb-backup-$(shell date +%Y%m%d-%H%M%S)"

# Clean everything (containers, volumes, images)
clean:
	@echo "WARNING: This will remove all containers, volumes, and images!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read dummy
	docker-compose down -v --rmi all

# Clean and rebuild
rebuild: clean build up

# View resource usage
stats:
	docker stats

# Inspect backend container
inspect-backend:
	docker inspect car-rental-backend

# Inspect frontend container
inspect-frontend:
	docker inspect car-rental-frontend

# Inspect database container
inspect-db:
	docker inspect car-rental-mongodb

# Pull latest images
pull:
	docker-compose pull

# Update and restart
update: pull down up

# Health check
health:
	@echo "Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "Backend health:"
	@docker inspect --format='{{json .State.Health}}' car-rental-backend 2>/dev/null || echo "Container not running"
	@echo ""
	@echo "Frontend health:"
	@docker inspect --format='{{json .State.Health}}' car-rental-frontend 2>/dev/null || echo "Container not running"
	@echo ""
	@echo "MongoDB health:"
	@docker inspect --format='{{json .State.Health}}' car-rental-mongodb 2>/dev/null || echo "Container not running"
