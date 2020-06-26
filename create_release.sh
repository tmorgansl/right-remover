#!/bin/bash

set -e
#cleanup old builds
rm -rf dist/
rm -f addon.zip
rm -f source.zip

# build the addon zip
npm i
npm run build
cd dist
zip ../addon.zip -r .
cd ..

# generate the source zip
node_version=$(node -v)
npm_version=$(npm -v)

sed "s/NPM_VERSION/${npm_version}/g" review/addon_review_readme | sed "s/NODE_VERSION/${node_version}/g" > README

zip source.zip -r src -r webpack -r public tsconfig.json package.json package-lock.json README build.sh

#cleanup
rm README

echo "Release build complete! Please submit addon.zip and source.zip to the developer hub"
