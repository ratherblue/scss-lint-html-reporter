/**
 * @fileoverview SCSS Lint HTML reporter
 */


var TeamCityLogger = require('hairballs').TeamCityLogger;
var hairballs = require('hairballs');


function LintReporter() {

  /**
   * Returns array of files linted
   * @param {object} data - JSON object
   * @returns {array} - Array of files linted
   */
  this.lintedFiles = function(data) {
    return Object.keys(data);
  };

  /**
   * Some lint rules are syntax errors
   * @param {object} alert - Alert object
   * @returns {string} - Lint name
   */
  this.formatRuleName = function(alert) {
    if (alert.linter) {
      return alert.linter;
    } else {
      if (alert.reason.indexOf('Syntax Error: Invalid CSS') === 0) {
        return 'Syntax Error: Invalid CSS';
      } else {
        return 'Undefined Error';
      }
    }
  };

  /**
   * Update summary of individual file
   * @param {object} file - File object
   * @param {object} alert - Alert object
   * @returns {object} - Updated file
   */
  this.summarizeFile = function(file, alert) {

    var ruleUrl = (alert.linter ? this.ruleUrl + alert.linter.toLowerCase() : false);
    var ruleId = this.formatRuleName(alert);

    var messages = {
      line: alert.line,
      column: alert.column,
      message: alert.reason,
      severity: alert.severity,
      ruleId: ruleId,
      ruleUrl: ruleUrl
    };

    if (alert.severity === 'error') {
      file.errors++;

      file.errorList.push('line ' + alert.line + ', col ' + alert.column + ', ' + alert.reason);
    } else if (alert.severity === 'warning') {
      file.warnings++;
    }

    hairballs.updateOccurance(ruleId, alert.severity, ruleUrl);

    file.messages.push(messages);

    return file;
  };

  /**
   * Calculates the total number of files linted
   * @param {object} data - JSON object
   * @returns {void}
   */
  this.summarizeData = function(data) {

    for (var fileName in data) {

      this.teamCityLogger.testStart(fileName);

      var file = { path: fileName, errors: 0, warnings: 0, messages: [], errorList: [] };
      var alerts = data[fileName];

      for (var x = 0; x < alerts.length; x++) {
        hairballs.updateAlertSummary(alerts[x]);
        file = this.summarizeFile(file, alerts[x]);
      }

      if (file.errorList.length) {
        this.teamCityLogger.testFailed(fileName, file.errorList);
      }

      this.teamCityLogger.testEnd(fileName);
      hairballs.updateFileSummary(file);

      // remove messages so that handlebars doesn't print links in the report
      // @todo get rid of handlebars
      if (!this.fullReport) {
        file.messages = null;
      }
    }
  };

  /**
   * Fixes JSON output into usable data
   * @param {string} jsonString - JSON output from SCSS Lint
   * @returns {object} - Valid JSON Object
   */
  this.fixJSON = function(jsonString) {
    try {
      jsonString = jsonString
        .replace(/\n/g, '')
        .replace(/\r/g, '');

      var jsonObject = JSON.parse(jsonString);

      return jsonObject;

    } catch(err) {
      this.teamCityLogger.logMessage('SCSS Lint Error', 'An error occurred parsing the lint results', 'ERROR');

      console.log('An error occurred parsing the JSON: ' + err);
    }
  };

  /**
   * Determines what settings to apply to the data output should be used
   * @returns {void}
   */
  this.checkParameters = function() {
    var args = process.argv;

    for (var x = 0; x < args.length; x++) {
      var arg = args[x].toLowerCase();

      if (arg === '--teamcity') {
        this.useTeamCityReport = true;
      } else if (arg === '--lite') {
        this.fullReport = false;
      } else if (arg === '--nohtml') {
        this.generateHtml = false;
      } else if (arg === '-o') {
        if (args[x + 1]) {
          this.outputPath = args[x + 1];
        }
      }
    }
  };

  /**
   * Starts the Linting Report
   * @returns {object} - Object used to send to template for parsing
   */
  this.runReport = function(jsonOutput) {

    this.teamCityLogger.reportStart();

    this.checkParameters();

    var data = this.fixJSON(jsonOutput);

    this.summarizeData(data);

    hairballs.files.sort(hairballs.sortErrors);

    hairballs.errorOccurrences.sort(hairballs.sortOccurrences);
    hairballs.warningOccurrences.sort(hairballs.sortOccurrences);

    this.teamCityLogger.reportEnd();

    // output team city report to the console
    if (this.useTeamCityReport) {
      console.log(this.teamCityLogger.reportOutput.join('\n'));
    }

    return {
      fileSummary: hairballs.fileSummary,
      alertSummary: hairballs.alertSummary,
      files: hairballs.files,
      fullReport: this.fullReport,
      errorOccurrences: hairballs.errorOccurrences,
      warningOccurrences: hairballs.warningOccurrences,
      pageTitle: 'SCSS Lint Results' + (this.fullReport ? '' : ' (lite)')
    };
  };

  // initialization
  // @todo: probably a better way to organize this
  this.generateHtml = true;
  this.fullReport = true;
  this.useTeamCityReport = false;
  this.outputPath = 'scss-lint-report.html';
  this.teamCityLogger = new TeamCityLogger('SCSS Lint');
  this.ruleUrl = 'https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md#';
}

module.exports = LintReporter;
