#!/usr/bin/env node

var fs = require('fs');

var LintReporter = require('./js/lint-reporter');
var templateUtils = require('hairballs').templateUtils;

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
  input += chunk;
});

process.stdin.on('end', function(foo) {
  console.log(foo);
  var lintReporter = new LintReporter(input);

  var data = lintReporter.runReport();

  if (lintReporter.generateHtml) {
    fs.writeFile(lintReporter.outputPath, templateUtils.applyTemplates(data), function(err) {
      if (err) {
        throw err;
      }
    });
  }
});
