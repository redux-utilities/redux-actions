BIN=node_modules/.bin

MOCHA_ARGS= --compilers js:babel-register \
		--recursive \
		--require src/__tests__/init.js \
		src/**/*-test.js
MOCHA_TARGET=src/**/*-test.js

build:
	BABEL_ENV=commonjs $(BIN)/babel src --out-dir lib
	BABEL_ENV=commonjs NODE_ENV=production $(BIN)/webpack

clean:
	rm -rf lib dist

test: lint
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) $(MOCHA_TARGET)

test-watch: lint
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) -w $(MOCHA_TARGET)

lint:
	$(BIN)/eslint src

PHONY: build clean test test-watch lint
