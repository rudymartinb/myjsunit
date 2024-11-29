#!/bin/bash
clear

COVERAGE_DIR=var/coverage

mkdir -p $COVERAGE_DIR

NODE_V8_COVERAGE=/tmp/cca c8 -x tests/ -o $COVERAGE_DIR -r html node ./myrunner.js ./tests/myTestSuite.js

NODE_V8_COVERAGE=/tmp/cca c8 report -r text-summary > $COVERAGE_DIR/coverage-summary.txt

cat $COVERAGE_DIR/coverage-summary.txt
