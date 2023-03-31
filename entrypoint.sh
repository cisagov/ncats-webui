#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail

# Print usage information and exit.
function usage {
  echo "Usage:"
  echo "  ${0##*/} build"
  echo "  ${0##*/} start"
  exit 1
}

export PATH=./node_modules/.bin:$PATH

if [ $# -ne 1 ]; then
  usage
fi

case "$1" in
  build)
    echo "Building to dist/ ..."
    make build
    mkdir -p /usr/src/build
    cp -r dist /usr/src/build
    ;;
  start)
    echo "Starting up development server..."
    make build-dev
    ng serve --host 0.0.0.0 --port 4200 &
    PIDSERVE=$!
    ng test --port 9876 &
    PIDTEST=$!
    wait $PIDSERVE
    wait $PIDTEST
    ;;
  *)
    usage
    ;;
esac
