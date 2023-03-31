PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash
current_dir = $(shell pwd)

all: install gulp build

dev: install gulp build-dev

build: install install-config
	ng build --prod
	find dist -type f -print0 | sort -z | xargs -0 shasum | shasum > dist/config/app.version

build-dev: install-config
	find src -type f -print0 | sort -z | xargs -0 shasum | shasum > src/config/app.version

install:
	npm install
	bower --allow-root install

gulp: install
	gulp

install-config:
	cp -n src/config/config.sample.json src/config/config.json || :

dev-build:
	docker compose build

dev-start:
	docker compose up -d

dev-shell:
	# Use $$ to properly escape $ for makefile
	docker exec -it $$(docker ps | grep 0.0.0.0:4200 | awk '{print $$1}') /bin/bash

dev-logs:
	# Use $$ to properly escape $ for makefile
	docker logs -f $$(docker ps | grep 0.0.0.0:4200 | awk '{print $$1}')

dev-rebuild: dev-clean dev-build

dev-stop:
	docker compose down

dev-clean:
	docker compose down -v --rmi local

docker-web-server:
	# create the dist directory
	docker compose run --rm client make build
	# copy the dist director into a docker image
	docker build -t ncats/cyhy-web-server -f ./Dockerfile_dist .

clean:
	rm -rf ./bower_components
	rm -rf ./src/assets/bower
	rm -rf ./node_modules
	rm -rf ./dist
