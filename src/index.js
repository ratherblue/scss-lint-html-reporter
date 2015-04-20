#!/usr/bin/env node

var fs = require('fs');

var LintReporter = require('./js/lint-reporter');
var templateUtils = require('hairballs').templateUtils;


module.exports = function(input) {
  var lintReporter = new LintReporter(input);
  var data = lintReporter.runReport();

  if (lintReporter.generateHtml) {
    fs.writeFile(lintReporter.outputPath, templateUtils.applyTemplates(data), function(err) {
      if (err) {
        throw err;
      }
    });
  }
};
