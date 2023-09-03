dev:
	docker-compose up -d

down:
	docker-compose down

bootstrap:
	cp .env .env.example
	docker-compose up -d
	yarn install