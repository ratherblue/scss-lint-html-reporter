var fs = require('fs');

var LintReporter = require('./js/lint-reporter');
var templateUtils = require('hairballs').templateUtils;


module.exports = function(input) {
  var lintReporter = new LintReporter();
  var data = lintReporter.runReport(input);

  if (lintReporter.generateHtml) {
    fs.writeFile(lintReporter.outputPath, templateUtils.applyTemplates(data), function(err) {
      if(err) {
        throw err;
      }
    });
  }
};
