#!/usr/bin/env bash
#builds new container image and pushes it to dockerhub
set -e
GOOS=linux go build
docker build -t ejacobson96/milestoneapi .
docker push ejacobson96/milestoneapi
go clean