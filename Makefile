PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash
current_dir = $(shell pwd)

all: install gulp build

dev: install gulp build-dev

build: install install-config
	ng build --prod
	find dist -type f -print0 | sort --zero-terminated | xargs --null shasum | shasum > dist/config/app.version

build-dev: install-config
	find src -type f -print0 | sort --zero-terminated | xargs --null shasum | shasum > src/config/app.version

install:
	npm install
	bower --allow-root install

gulp: install
	gulp

install-config:
	cp --no-clobber src/config/config.sample.json src/config/config.json || :

dev-build:
	docker compose build

dev-start:
	docker compose up --detach

dev-shell:
	# Use $$ to properly escape $ for makefile
	docker exec --interactive --tty $$(docker ps | grep 0.0.0.0:4200 | awk '{print $$1}') /bin/bash

dev-logs:
	# Use $$ to properly escape $ for makefile
	docker logs --follow $$(docker ps | grep 0.0.0.0:4200 | awk '{print $$1}')

dev-rebuild: dev-clean dev-build

dev-stop:
	docker compose down

dev-clean:
	docker compose down --volumes --rmi local

docker-web-server:
	# create the dist directory
	docker compose run --rm client make build
	# copy the dist director into a docker image
	docker build --tag ncats/cyhy-web-server --file ./Dockerfile_dist .

clean:
	rm --recursive --force ./bower_components
	rm --recursive --force ./src/assets/bower
	rm --recursive --force ./node_modules
	rm --recursive --force ./dist
