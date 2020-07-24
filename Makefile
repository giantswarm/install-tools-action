lint:
	./node_modules/.bin/eslint --ext .js ./index.js

deps:
	npm install @actions/core
	npm install @actions/github
	npm install @actions/tool-cache

init:
	npm install --save-dev eslint-config-airbnb-base eslint@^3.0.1 eslint-plugin-import@^1.10.3
