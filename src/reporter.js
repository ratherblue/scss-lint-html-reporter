/**
 * @fileoverview SCSS Lint HTML reporter
 * @author Evangelia Dendramis
 */

'use strict';

require('shelljs/global');
var fs = require('fs');
//var path = require('path');
//var handlebars = require('handlebars');
var hbsUtil = require('./js/hbs-util');
var ciUtil = require('./js/ci-util');
//console.log('foo2');


var unescapeStr = function(str) {

  if (!str) {
    return '';
  }

  return str
    .replace(/\n/g, '')
    .replace(/\r/g, '');
};

var result = exec('scss-lint . -f JSON');

var output = JSON.parse(unescapeStr(result.output));

ciUtil.reportStart('teamCity');

for (var obj in output) {
  ciUtil.testStart(obj, 'teamCity');

  var messageList = [];
  for (var x = 0; x < output[obj].length; x++) {
    var msg = output[obj][x];

    if (msg.severity === 'error') {
      messageList.push('line ' + msg.line + ', col ' + msg.column + ', ' + msg.reason);
    }
    //console.log(msg.linter);
  }

  if (messageList.length) {
    ciUtil.testFailed(obj, messageList, 'teamCity');
  }

  ciUtil.testEnd(obj, 'teamCity');
  //console.log('obj', obj);
}


ciUtil.reportEnd('teamCity');

//console.log(typeof JSON.stringify(JSON.parse(output)));

fs.writeFile('foo.json', hbsUtil.applyTemplates({ myObject: output }));
