#!/usr/bin/env bash

set -e

export NETWORK=milestonenetwork
#pull updated container image to the droplet
docker pull ejacobson96/milestoneapi
#removes any existing instances running called milestoneapi
docker rm -f milestoneapi
docker rm -f milestone-redis
docker rm -f milestone-mongo
docker rm -f messagingService
docker rm -f goalService

# Remove dangling images
if [ "$(docker images -q -f dangling=true)" ]; then
    echo "Removing dangling images..."
    docker rmi $(docker images -q -f dangling=true)
fi
docker system prune -f

# Create Docker private network if it does not exist.
if ! [ "$(docker network ls | grep $NETWORK)" ]; then
    echo "Creating Docker network..."
    docker network create $NETWORK
fi

docker run --name milestone-redis -d --network $NETWORK redis
docker run --name milestone-mongo -d --network $NETWORK mongo

docker pull ejacobson96/messaging
docker pull ejacobson96/progress

docker run -d --name messagingService --network $NETWORK -e DBADDR=milestone-mongo:27017 ejacobson96/messaging
docker run -d --name goalService --network $NETWORK -e DBADDR=milestone-mongo:27017 ejacobson96/progress

#allows access to the host's etc/letsencrypt files
docker run -d -p 443:443 --name milestoneapi --network $NETWORK -v /etc/letsencrypt:/etc/letsencrypt:ro -e TLSCERT=/etc/letsencrypt/live/api.milestoneapp.org/fullchain.pem -e TLSKEY=/etc/letsencrypt/live/api.milestoneapp.org/privkey.pem -e REDISADDR=milestone-redis:6379 -e DBADDR=milestone-mongo:27017 -e SESSIONKEY=production -e MESSAGESSVCADDR=messagingService:80 -e GOALSSVCADDR=goalService:80 ejacobson96/milestoneapi
