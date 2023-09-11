dev:
	docker-compose up -d

down:
	docker-compose down
	docker volume prune -f

bootstrap:
	cp .env .env.example
	docker-compose up -d
	yarn install

pre-deploy:
	docker image build -t aloha-dev .
	docker image tag aloha-dev:latest 560730833886.dkr.ecr.ap-southeast-1.amazonaws.com/aloha-dev:latest
	docker push 560730833886.dkr.ecr.ap-southeast-1.amazonaws.com/aloha-dev:latest

deploy-dev:
	docker-compose -f docker-compose.dev.yml pull
	docker-compose -f docker-compose.dev.yml up -d