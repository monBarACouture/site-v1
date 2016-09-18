#! /bin/bash

pushd $(dirname $0)

COMMIT="$1"

# extract the package
tar xzf package.tgz
rm package.tgz
mv sources "$COMMIT"

if [ -L latest ];
then
	unlink latest
fi
ln -s "$COMMIT" latest

popd
