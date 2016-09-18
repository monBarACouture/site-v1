#! /bin/bash

# stop script with non-zero exit code if anything go wrong
set -e

# stop script with non-zero exit code when trying to reference an undefined
# variable
set -u

# If any command in a pipeline fails, that return code will be used as the
# return code of the whole pipeline
set -o pipefail

if [ "$TRAVIS_BRANCH" = master ];
then
    # inject 'production' environment variables
    . "$PWD/scripts/production.env"
else
    # inject 'development' environment variables
    . "$PWD/scripts/development.env"
fi

# deploy sources on remote server

export SSHPASS=$DEPLOY_PASSWORD
export SSH_OPTIONS=-o stricthostkeychecking=no

tar czf package.tgz sources
sshpass -e scp $SSH_OPTIONS package.tgz "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR"
sshpass -e scp $SSH_OPTIONS scripts/remote-deploy.sh package.tgz "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR"
