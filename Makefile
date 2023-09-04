dev:
	docker-compose up -d

down:
	docker-compose down
	docker volume prune -f

bootstrap:
	cp .env .env.example
	docker-compose up -d
	yarn install