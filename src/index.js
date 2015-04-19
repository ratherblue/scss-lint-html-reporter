#!/usr/bin/env node


var fs = require('fs');
var path = require('path');

var LintReporter = require('./js/lint-reporter');
var templateUtils = require('hairballs').templateUtils;

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
  input += chunk;
});

process.stdin.on('end', function() {
  var lintReporter = new LintReporter(input);

  var data = lintReporter.runReport();

  fs.writeFile(path.join(__dirname, 'scss-lint-report.html'), templateUtils.applyTemplates(data));

  //console.log(templateUtils.applyTemplates(data));
});
