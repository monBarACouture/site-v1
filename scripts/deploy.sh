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
	export ENV=production
    . "$PWD/scripts/production.env"
else
    # inject 'development' environment variables
	export ENV=staging
    . "$PWD/scripts/staging.env"
fi

# deploy sources on remote server

export SSHPASS=$DEPLOY_PASSWORD
export SSH_OPTIONS="-o stricthostkeychecking=no"

SCP="sshpass -e scp $SSH_OPTIONS"
SSH="sshpass -e ssh $SSH_OPTIONS"

$SCP scripts/remote-deploy.sh "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR"
$SSH "$DEPLOY_USER@$DEPLOY_HOST" "$DEPLOY_DIR/remote-deploy.sh" "$TRAVIS_COMMIT" "$ENV"
