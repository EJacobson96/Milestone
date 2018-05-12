#!/usr/bin/env bash

set -e

./build.sh

export CILENT_CONTAINER=milestone-client

# Push the most recent client container to DockerHub
echo "Pushing the newest client container..."
docker push ejacobson96/$CILENT_CONTAINER

# SSH into the client droplet and execute the client deployment script
echo "SSH-ing into the client droplet..."
ssh root@milestone.eric-jacobson.me 'bash -s' < run.sh