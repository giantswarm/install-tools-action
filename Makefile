lint:
	NODE_OPTIONS="--no-warnings" ./node_modules/.bin/eslint --ext .js ./index.js

deps:
	npm install @actions/core
	npm install @actions/exec
	npm install @actions/tool-cache

init:
	npm install --save-dev eslint
