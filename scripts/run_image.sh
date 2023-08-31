#!/bin/bash
image_name='rad-var-apartmanhaz-frontend'
image_tag='latest'
port='4201'

docker stop $image_name

docker rm $image_name

docker run -p $port:80 --name $image_name -d $image_name:$image_tag