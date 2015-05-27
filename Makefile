NODE_BIN=./node_modules/.bin
MOCHA=$(NODE_BIN)/mocha
COVERALLS=$(NODE_BIN)/coveralls

test:
	@$(MOCHA) -R spec

coveralls:
	istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec \
	&& cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js \
	&& rm -rf ./coverage