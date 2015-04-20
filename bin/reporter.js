#!/usr/bin/env node

var htmlReport = require('../src/index.js');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
  input += chunk;
});

process.stdin.on('end', function() {
  htmlReport(input);
});
