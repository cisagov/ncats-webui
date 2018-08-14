#!/bin/bash
export PATH=./node_modules/.bin:$PATH

case "$1" in

build) echo "Building to dist/ ..."
    make build
    mkdir -p /usr/src/build
    cp -r dist /usr/src/build
    ;;
*) echo "Starting up development server..."
   make build-dev
   ng serve --host 0.0.0.0 --port 4200 &  PIDSERVE=$!
   ng test --port 9876 &  PIDTEST=$!
   wait $PIDSERVE
   wait $PIDTEST
   ;;
esac
