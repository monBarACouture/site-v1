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
	export DEPLOY_ENV=production
else
	# inject 'staging' environment variables
	export DEPLOY_ENV=staging
fi

# deploy sources on remote server

export DEPLOY_DIR="$DEPLOY_BASE_DIR/$DEPLOY_ENV"
export SSHPASS=$DEPLOY_PASSWORD
export SSH_OPTIONS="-o stricthostkeychecking=no"

tar cvz \
		-f package.tgz \
		-s ":^:$TRAVIS_COMMIT/:" \
		--exclude ".git" \
	docker sources scripts

SCP="sshpass -e scp $SSH_OPTIONS"
SSH="sshpass -e ssh $SSH_OPTIONS"

$SCP scripts/remote-deploy.sh package.tgz "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR"
$SSH "$DEPLOY_USER@$DEPLOY_HOST" "$DEPLOY_DIR/remote-deploy.sh" "$TRAVIS_COMMIT" "$DEPLOY_ENV"
