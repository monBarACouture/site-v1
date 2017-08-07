#! /bin/bash

COMMIT="$1"
DATE=$(date +"%m.%d.%y-%H:%M:%S")
DEPLOY_DIR=$(dirname "$0")
CONTAINER_NAME="mbac-v1"
IMAGE_NAME="mbac-v1:$COMMIT"

echo $DEPLOY_DIR
echo $COMMIT
echo $DATE
echo CONTAINER_NAME
echo IMAGE_NAME

# mkdir -p "$DEPLOY_DIR"
#
# pushd "$DEPLOY_DIR"
#
# mkdir -p "$DEPLOY_DIR"
# mkdir -p "$DEPLOY_DIR/logs"
# mkdir -p "$DEPLOY_DIR/config"
#
# git pull https://github.com/monBarACouture/site-v1.git mbac
# git checkout "$COMMIT"
#
# pushd "$DEPLOY_DIR"
# pushd mbac
#
# if docker ps -a --format "{{.Names}}"| grep -q "$CONTAINER_NAME";
# then
# 	docker stop "$CONTAINER_NAME"
# 	docker rm "$CONTAINER_NAME"
# fi
#
# docker build -t "$IMAGE_NAME" -f docker/web/Dockerfile .
#
# popd # => $DEPLOY_DIR
#
# docker run \
# 	-d \
# 	-v "$PWD/config:/var/www/html/config" \
# 	-e VIRTUAL_HOST \
# 	--link "smtp" \
# 	--name "$CONTAINER_NAME" \
# 	"$IMAGE_NAME"
#
# popd # => $(dirname $0)
#
# popd # => /
