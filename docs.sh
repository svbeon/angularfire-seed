#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" != "master" ]; then exit; fi
if [ ! -f deploy.key ]; then exit; fi

eval `ssh-agent -s`
ssh-add deploy.key
git clone -b master %repo% .deploy || exit 1
cd .deploy || exit 1
git config user.name travis
git config user.email travis@nowhere
cp -R ../docs/%app_name%/* .
git add -A
git commit -m "travis: $TRAVIS_COMMIT"
git push || exit 1
cd ..
