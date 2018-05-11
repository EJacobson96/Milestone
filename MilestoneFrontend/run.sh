#!/usr/bin/env bash

export CILENT_CONTAINER=milestone-client

# Pull the newest version of the client
echo "Pulling newest version of the container..."
docker pull ejacobson96/$CLIENT_CONTAINER

# Remove the client container if it already exists
if [ "$(docker ps -aq --filter name=$CLIENT_CONTAINER)" ]; then
    echo "Removing the client container..."
    docker rm -f $CLIENT_CONTAINER
fi

# Clean up old images
docker image prune -f

# Run the new client container
docker run -d -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt:ro --name $CLIENT_CONTAINER ejacobson96/$CLIENT_CONTAINER