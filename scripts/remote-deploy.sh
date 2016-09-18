#! /bin/bash

pushd $(dirname $0)

COMMIT="$1"
DATE=$(date +"%m.%d.%y-%H:%M:%S")

# extract the package
tar xzf package.tgz
mv sources "$COMMIT"

# link to latest
if [ -L latest ];
then
	unlink latest
fi
ln -s "$COMMIT" latest

# update deployment log file
cat >> deploy.log <<EOF
$DATE $COMMIT
EOF

# clean
rm package.tgz
rm remote-deploy.sh

popd
