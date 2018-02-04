#!/usr/bin/env bash

set -e

# Determine current operating system.
# If OS is Windows, localhost will be set to VM linux address.
# This only applies to Docker containers.
localhost=127.0.0.1
if [[ "$OSTYPE" == 'msys' ]]; then
    localhost=192.168.99.100
fi

echo "Default localhost address for Docker containers is set to" $localhost

# Export environment variables.
export ADDR=localhost:4000

export TLSKEY=tls/privkey.pem
export TLSCERT=tls/fullchain.pem

export REDISADDR=$localhost:6379
export DBADDR=$localhost:27017

export SESSIONKEY=dev

# remove any existing containers
# docker rm -f devredis
# docker rm -f devmongo

docker run --name devredis -d -p 6379:6379 redis

# Run Mongo Docker container.
docker run --name devmongo -d -p 27017:27017 mongo

# Run Game API.
go run main.go