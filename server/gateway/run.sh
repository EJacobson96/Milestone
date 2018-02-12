#pull updated container image to the droplet
docker pull ejacobson96/milestoneapi
#removes any existing instances running called milestoneapi
docker rm -f milestoneapi
docker rm -f milestone-redis
docker rm -f milestone-mongo
docker rm -f messagingService

docker run --name milestone-redis -d --network milestonenetwork redis
docker run --name milestone-mongo -d --network milestonenetwork mongo

docker pull ejacobson96/messagingService
docker run -d --name messagingService --network milestonenetwork -e DBADDR=mongodemo:27017 ejacobson96/messagingService

#allows access to the host's etc/letsencrypt files
docker run -d -p 443:443 --name milestoneapi --network milestonenetwork -v /etc/letsencrypt:/etc/letsencrypt:ro \
-e TLSCERT=/etc/letsencrypt/live/milestoneapi.eric-jacobson.me/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/milestoneapi.eric-jacobson.me/privkey.pem -e REDISADDR=milestone-redis:6379 \
-e DBADDR=milestone-mongo:27017 -e SESSIONKEY=production -e MESSAGESSVCADDR=messagingService:80 ejacobson96/milestoneapi
