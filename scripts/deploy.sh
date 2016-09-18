#! /bin/bash

# stop script with non-zero exit code if anything go wrong
set -e

# stop script with non-zero exit code when trying to reference an undefined
# variable
set -u

# If any command in a pipeline fails, that return code will be used as the
# return code of the whole pipeline
set -o pipefail

if [ "$TRAVIS_BRANCH" = master];
then
    # inject 'production' environment variables
    . "$PWD/scripts/production.env"
else
    # inject 'development' environment variables
    . "$PWD/scripts/development.env"
fi

# TODO deploy code to remote server
