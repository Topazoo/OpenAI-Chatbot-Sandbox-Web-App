#! /bin/bash

export AWS_PROFILE=personal-projects
source .env
npm run build --prefix ../client/app
aws s3 sync ../client/app/build/ s3://character-creator-frontend --acl public-read
