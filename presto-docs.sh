#!/bin/sh

set -eu

usage() {
    echo "presto-docs.sh VERSION PRESTO_GIT_REPO_PATH"
    exit $1
}

if [ $# -eq 0 ]; then
    echo "No arguments provided"
    usage 1
fi

if [ $# -eq 1 ]; then
    echo "Only one argument provided"
    usage 1
fi

if [ $# -gt 2 ]; then
    echo "Too many arguments provided"
    usage 1
fi

[ "$1" = -h ] && usage 0

VERSION=$1

#Check version is expected format
set +e
_=`echo "$VERSION" | grep "^0\.\d\d\d$"`
if [ $? -ne 0 ]; then
    echo "Only supported version format is "0.ddd". Script doesn't correctly calculate the prior version for generating statistics."
    exit 1
fi
set -e

PRESTO_GIT_REPO=$2
TARGET=website/static/docs/$VERSION
CURRENT=website/static/docs/current

REPOSITORY=$HOME/.m2/repository
GROUP=com.facebook.presto
ARTIFACT=presto-docs

GROUPDIR=$(echo $GROUP | tr . /)

CENTRAL=central::default::https://repo1.maven.apache.org/maven2

if [ -e $TARGET ]
then
echo "already exists: $TARGET"
exit 100
fi

mvn org.apache.maven.plugins:maven-dependency-plugin:2.8:get \
-Dartifact=$GROUP:$ARTIFACT:$VERSION:zip -DremoteRepositories=$CENTRAL

unzip $REPOSITORY/$GROUPDIR/$ARTIFACT/$VERSION/$ARTIFACT-$VERSION.zip

mv html $TARGET

ln -sfh $VERSION $CURRENT

git add $TARGET $CURRENT


#Calculate last version
LAST_VERSION=`echo "${VERSION}-0.001" | bc`
LAST_VERSION="0${LAST_VERSION}"
DATE=`TZ=America/Los_Angeles date "+%B %d, %Y"`

VERSION_JS=website/static/static/js/version.js

#Update the version number and stats in javascript for rendering across the site
echo "const presto_latest_presto_version = '$VERSION';" > $VERSION_JS
GIT_LOG="git -C ${PRESTO_GIT_REPO} log --use-mailmap ${LAST_VERSION}..${VERSION}"
NUM_COMMITS=`${GIT_LOG} --format='%aE' | wc -l | awk '{$1=$1;print}'`
NUM_CONTRIBUTORS=`${GIT_LOG} --format='%aE' | sort | uniq | wc -l | awk '{$1=$1;print}'`
NUM_COMMITTERS=`${GIT_LOG} --format='%cE' | sort | uniq | wc -l | awk '{$1=$1;print}'`
echo "const presto_latest_num_commits = ${NUM_COMMITS};" >> $VERSION_JS
echo "const presto_latest_num_contributors = ${NUM_CONTRIBUTORS};" >> $VERSION_JS
echo "const presto_latest_num_committers = ${NUM_COMMITTERS};" >> $VERSION_JS
echo "const presto_latest_date = '${DATE}';" >> $VERSION_JS

git add website/static/static/js/version.js

git commit -m "Add $VERSION docs"
