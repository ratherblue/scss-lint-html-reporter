# SCSS Lint HTML Reporter
Reporter to go along with [SCSS Lint](https://github.com/brigade/scss-lint).

## Features:

### HTML Report
Generates an HTML file containing:
  * Top 5 errors and warnings
  * Summary of number of errors and warnings
  * List of files linted and the details of their accompanying errors and/or warnings

### "Lite" HTML Report

Same thing as the HTML report but the list of files does not include their accompanying errors and/or warnings (only the number)

(Um... why?) If you are linting a lot of SCSS files and they contains hundreds of errors, the generated HTML report will be several megabytes in size.

Since the "lite" report only shows the filename with its number of errors/warnings, this output helps you more easily identify which files need to be ignored or addressed.

### Optional TeamCity Integration
In addition to the HTML file, you can also flag the reporter to include TeamCity console output.

(You can also disable the HTML report completely and just use the TeamCity output.)

## Requirements
To use this package you must have [SCSS Lint](https://github.com/brigade/scss-lint) installed and you must meet their [requirements](https://github.com/brigade/scss-lint#requirements) for Ruby and Sass.

Note: Compiling SCSS does not require Ruby, but to use **SCSS Lint** you have to install Ruby and Sass.

## Installation

```sh
npm install scss-lint-html-reporter
```

## Usage

To use this package you must first run SCSS Lint with the **JSON Formatter** and then pipe the output to the reporter.

Examples:

```sh
scss-lint -f JSON | node_modules/scss-lint-html-reporter/bin/reporter.js

```

## Command Line Options

**-o `<filename>`**

Specify the output of the HTML report. (Defaults to `scss-lint-report.html`)

```sh
scss-lint -f JSON | node_modules/scss-lint-html-reporter/bin/reporter.js -o my-report.html

```


**--lite**

Turns off detailed output.

```sh
scss-lint -f JSON | node_modules/scss-lint-html-reporter/bin/reporter.js --lite

```

**--teamcity**

Enables TeamCity output

Example:

```sh
scss-lint -f JSON | node_modules/scss-lint-html-reporter/bin/reporter.js --teamcity

```

With "lite" html file:

```sh
scss-lint -f JSON | node_modules/scss-lint-html-reporter/bin/reporter.js --teamcity --lite

```

**--nohtml**

Disables generation of the html file. (Note: If you don't have the `--teamcity` option, running the linter will do nothing.)

Example:

```sh
scss-lint -f JSON | node_modules/scss-lint-html-reporter/bin/reporter.js --nohtml --teamcity
```
