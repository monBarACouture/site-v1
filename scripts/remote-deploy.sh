#! /bin/bash

pushd $(dirname $0)

COMMIT="$1"

# extract the package
tar xzf package.tgz
rm package.tgz
