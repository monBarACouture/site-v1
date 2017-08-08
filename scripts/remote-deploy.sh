#! /bin/bash

COMMIT="$1"
DEPLOY_ENV="$2"
DEPLOY_DIR=$(dirname "$0")

CONTAINER_NAME="mbac-v1"
DATE=$(date +"%m.%d.%y-%H:%M:%S")
IMAGE_NAME="mbac-v1:$COMMIT"

check_container() {
	CONTAINER="$1"
	docker ps -a --format "{{.Names}}"| grep -q "$CONTAINER"
}

check_running_container() {
	CONTAINER="$1"
	docker ps --format "{{.Names}}"| grep -q "$CONTAINER"
}

pushd "$DEPLOY_DIR"

mkdir -p "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/logs"
mkdir -p "$DEPLOY_DIR/config"

rm -fr "$COMMIT"

tar xvzf package.tgz

pushd "$COMMIT"

ENV_FILE="$PWD/scripts/$DEPLOY_ENV.env"

# Check for depences.
for CONTAINER in nginx-proxy gmail-exim4;
do
	if check_running_container "$CONTAINER";
	then
		echo "$CONTAINER container is running"
	else
		(>&2 echo "Error: $CONTAINER container is not running")
		exit 1
	fi
done

# Destroy current app container.
if check_container "$CONTAINER_NAME";
then
	echo "Destroy $CONTAINER_NAME container"
	docker stop "$CONTAINER_NAME"
	docker rm "$CONTAINER_NAME"
fi

# Build the next app container.
docker build -t "$IMAGE_NAME" -f docker/web/Dockerfile .

popd # => $DEPLOY_DIR

# Run the app container.
docker run \
	-d \
	--env-file "$ENV_FILE" \
	--link "gmail-exim4:smtp" \
	--name "$CONTAINER_NAME" \
	--volume "$PWD/config:/var/www/html/config" \
	--volume "$PWD/logs:/var/log/apache2" \
	"$IMAGE_NAME"

# Do the cleaning.
rm -fr remote-deploy.sh package.tgz "$COMMIT"

popd # => /
