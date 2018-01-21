#pull updated container image to the droplet
docker pull ejacobson96/milestoneapi
#removes any existing instances running called milestoneapi
docker rm -f milestoneapi
#allows access to the host's etc/letsencrypt files
docker run -d -p 443:443 --name milestoneapi -v /etc/letsencrypt:/etc/letsencrypt:ro \
-e TLSCERT=/etc/letsencrypt/live/milestoneapi.eric-jacobson.me/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/milestoneapi.eric-jacobson.me/privkey.pem \
ejacobson96/milestoneapi