local-up:
	docker-compose up -d

local-down:
	docker-compose down

bootstrap:
	cp .env .env.example
	cp .env.development .env.example
	docker-compose up -d
	yarn install

pre-deploy:
	docker image prune -f
	docker image build -t aloha-dev .
	docker image tag aloha-dev:latest 560730833886.dkr.ecr.ap-southeast-1.amazonaws.com/aloha-dev:latest
	docker push 560730833886.dkr.ecr.ap-southeast-1.amazonaws.com/aloha-dev:latest

dev-up:
	docker-compose -f docker-compose.dev.yml pull
	docker-compose -f docker-compose.dev.yml up -d
	docker image prune -f

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-ps:
	docker-compose -f docker-compose.dev.yml ps

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f aloha

ssh:
	docker exec -it aloha-server_aloha_1 bash