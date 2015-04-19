/**
 * @fileoverview SCSS Lint HTML reporter
 * @author Evangelia Dendramis
 */

var TeamCityLogger = require('hairballs').TeamCityLogger;
var hairballs = require('hairballs');


function LintReporter(jsonOutput) {

  /**
   * Returns array of files linted
   * @param {object} data - JSON object
   * @returns {array} - Array of files linted
   */
  this.lintedFiles = function(data) {
    return Object.keys(data);
  };


  /**
   * Update summary of individual file
   * @param {object} file - File object
   * @param {object} alert - Alert object
   * @returns {object} - Updated file
   */
  this.summarizeFile = function(file, alert) {

    var ruleUrl = (alert.linter ? this.ruleUrl + alert.linter.toLowerCase() : false);

    var messages = {
      line: alert.line,
      column: alert.column,
      message: alert.reason,
      severity: alert.severity,
      ruleId: (alert.linter ? alert.linter : false),
      ruleUrl: ruleUrl
    };

    if (alert.severity === 'error') {
      file.errors++;

      file.errorList.push('line ' + alert.line + ', col ' + alert.column + ', ' + alert.reason);
    } else if (alert.severity === 'warning') {
      file.warnings++;
    }

    hairballs.updateOccurance(alert.linter, alert.severity, ruleUrl);

    file.messages.push(messages);

    return file;
  };


  /**
   * Calculates the total number of files linted
   * @param {object} data - JSON object
   * @returns {void}
   */
  this.summarizeData = function(data) {

    var teamCityLogger = new TeamCityLogger('SCSS Lint');
    teamCityLogger.reportStart();

    for (var fileName in data) {

      teamCityLogger.testStart(fileName);

      var file = { path: fileName, errors: 0, warnings: 0, messages: [], errorList: [] };
      var alerts = data[fileName];

      for (var x = 0; x < alerts.length; x++) {
        hairballs.updateAlertSummary(alerts[x]);
        file = this.summarizeFile(file, alerts[x]);
      }

      if (file.errorList.length) {
        teamCityLogger.testFailed(fileName, file.errorList);
      }

      teamCityLogger.testEnd(fileName);
      hairballs.updateFileSummary(file);
    }

    teamCityLogger.reportEnd();

    console.log(teamCityLogger.reportOutput.join('\n'));
  };


  /**
   * Fixes JSON output into usable data
   * @param {string} jsonString - JSON output from SCSS Lint
   * @returns {object} - Valid JSON Object
   */
  this.fixJSON = function(jsonString) {
    if (!jsonString) {
      return '';
    }

    jsonString = jsonString
      .replace(/\n/g, '')
      .replace(/\r/g, '');

    return JSON.parse(jsonString);
  };

  this.runReport = function() {
    var data = this.fixJSON(jsonOutput);
    this.summarizeData(data);

    hairballs.files.sort(hairballs.sortErrors);
    var fullReport = true;

    return {
      fileSummary: hairballs.fileSummary,
      alertSummary: hairballs.alertSummary,
      files: hairballs.files,
      fullReport: fullReport,
      errorOccurances: hairballs.errorOccurances,
      warningOccurances: hairballs.warningOccurances,
      pageTitle: 'SCSS Lint Results' + (fullReport ? '' : ' (lite)')
    };
  };

  // initialization
  this.ruleUrl = 'https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md#';
}

module.exports = LintReporter;
