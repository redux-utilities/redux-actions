BIN=node_modules/.bin

MOCHA_ARGS= --compilers js:babel-register \
		--recursive \
		--require src/__tests__/init.js \
		src/**/*-test.js
MOCHA_TARGET=src/**/*-test.js

build:
	$(BIN)/babel src --out-dir lib

clean:
	rm -rf lib

test: lint
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) $(MOCHA_TARGET)

test-typings:
	if [ ! -f $(BIN)/tsc ]; then npm install typescript; fi
	$(BIN)/tsc --noEmit --noImplicitAny src/__tests__/typescript-typings-test.ts

test-watch: lint
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) -w $(MOCHA_TARGET)

lint:
	$(BIN)/eslint src

PHONY: build clean test test-watch lint
