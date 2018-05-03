#!/usr/bin/env bash

set -e

export CILENT_CONTAINER=milestone-client

# Build the production version of the client
echo "Building source files via Webpack..."
npm run build

# Build the client Docker container image
echo "Building Docker container..."
docker build -t ejacobson96/$CILENT_CONTAINER .

if [ "$(docker ps -aq --filter name=$CILENT_CONTAINER)" ]; then
    echo "Removing client container..."
    docker rm -f $CILENT_CONTAINER
fi

# Remove dangling images.
if [ "$(docker images -q -f dangling=true)" ]; then
    echo "Removing dangling images..."
    docker rmi $(docker images -q -f dangling=true)
fi