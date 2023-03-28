#! /bin/bash

eb init --profile personal-projects
eb use Charactercreatorprod-env
eb setenv `cat .env | sed '/^#/ d' | sed '/^$/ d'`
eb deploy
