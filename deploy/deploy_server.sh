#! /bin/bash

export AWS_PROFILE=personal-projects
aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 767462030548.dkr.ecr.us-west-1.amazonaws.com
docker build --no-cache ../server -t character-creator-prod
docker tag character-creator-prod:latest 767462030548.dkr.ecr.us-west-1.amazonaws.com/character-creator-prod:latest
docker push 767462030548.dkr.ecr.us-west-1.amazonaws.com/character-creator-prod:latest

./deploy_elb.sh
