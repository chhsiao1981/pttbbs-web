#!/bin/bash

if [ "$1" == "" ]; then
    echo "usage: deploy_all [dir]"
    exit 255
fi

theDir="$1"

npm run build

rsync -zah dist/ ${theDir}
