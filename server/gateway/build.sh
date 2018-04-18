#!/usr/bin/env bash
#builds new container image and pushes it to dockerhub
set -e
GOOS=linux go build
docker build -t ejacobson96/milestoneapi .
docker push ejacobson96/milestoneapi
go clean
cd ../messaging
GOOS=linux go build
docker build -t ejacobson96/messaging .
docker push ejacobson96/messaging
go clean
cd ../goal_planning
GOOS=linux go build
docker build -t ejacobson96/goal_planning .
docker push ejacobson96/goal_planning
go clean

cd ../gateway
