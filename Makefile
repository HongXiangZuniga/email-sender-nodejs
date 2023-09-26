IMAGE_NAME := mail-sender

run:
	npm start

install:
	npm install

docker-build:
	docker build \
	-f build/Dockerfile \
	--build-arg SSH_PRIVATE_KEY=$(SSH_PRIVATE_KEY) \
	--build-arg O=$(OFFSET) \
	--build-arg L=$(LIMIT) \
	-t hong/${IMAGE_NAME}:local .

docker-run:
	docker run --rm -it \
	--env-file ./.env \
	hong/${IMAGE_NAME}:local