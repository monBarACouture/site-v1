#! /bin/bash

DEPLOY_COMMIT="$1"
DEPLOY_ENV="$2"


DEPLOY_CONTAINER_NAME="mbac-v1-$DEPLOY_ENV"
DEPLOY_DATE=$(date +"%m.%d.%y-%H:%M:%S")
DEPLOY_DIR=$(dirname "$0")
DEPLOY_DATA_FILE="$DEPLOY_DIR/data.tgz"
DEPLOY_LOG_FILE=$(dirname "$DEPLOY_DIR")/deploy.log
DEPLOY_IMAGE_NAME="mbac-v1:$DEPLOY_COMMIT"

check_container() {
	CONTAINER="$1"
	docker ps -a --format "{{.Names}}"| grep -q "$CONTAINER"
}

check_running_container() {
	CONTAINER="$1"
	docker ps --format "{{.Names}}"| grep -q "$CONTAINER"
}

pushd "$DEPLOY_DIR"

rm -fr "$DEPLOY_COMMIT"
mkdir -p "$DEPLOY_COMMIT"
mkdir -p "logs"
mkdir -p "config"

pushd "$DEPLOY_COMMIT"

tar xvzf "$DEPLOY_DATA_FILE"

# Check for depences.
for CONTAINER in nginx-proxy;
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
if check_container "$DEPLOY_CONTAINER_NAME";
then
	echo "Destroy $DEPLOY_CONTAINER_NAME container"
	docker stop "$DEPLOY_CONTAINER_NAME"
	docker rm "$DEPLOY_CONTAINER_NAME"
fi

# Build the next app container.
# docker build -t "$DEPLOY_IMAGE_NAME" -f docker/web/Dockerfile .

popd # => $DEPLOY_DIR

# Run the app container.
docker run \
	-d \
	--env-file "env" \
	--name "$DEPLOY_CONTAINER_NAME"  \
	--volume $PWD/sources:/usr/share/nginx/html:ro \
	-p 8080:80 \
	nginx

# docker run \
# 	-d \
# 	--env-file "env" \
# 	--name "$DEPLOY_CONTAINER_NAME" \
# 	--volume
# 	--volume "$PWD/config:/var/www/html/config" \
# 	--volume "$PWD/logs:/var/log/apache2" \
# 	"$DEPLOY_IMAGE_NAME"

# Do the cleaning.
rm -fr remote-deploy.sh "$DEPLOY_DATA_FILE" "$DEPLOY_COMMIT"

cat >> "$DEPLOY_LOG_FILE" <<EOF
${DEPLOY_ENV} ${DEPLOY_DATE} ${DEPLOY_COMMIT}
EOF

popd # => /
