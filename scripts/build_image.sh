#!/bin/bashs
image_name='rad-var-apartmanhaz-frontend'
image_tag='latest'

docker build -t $image_name:$image_tag -f .container/Dockerfile .