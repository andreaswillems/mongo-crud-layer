NODE_BIN=./node_modules/.bin
MOCHA=$(NODE_BIN)/mocha
COVERALLS=$(NODE_BIN)/coveralls

test:
	@$(MOCHA) -R spec

coveralls:
	@$(MOCHA) -R mocha-lcov-reporter | $(COVERALLS)