["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/debug/console.js"],"~:js","goog.provide(\"goog.debug.Console\");\ngoog.require(\"goog.debug.LogManager\");\ngoog.require(\"goog.debug.Logger\");\ngoog.require(\"goog.debug.TextFormatter\");\ngoog.debug.Console = function() {\n  this.publishHandler_ = goog.bind(this.addLogRecord, this);\n  this.formatter_ = new goog.debug.TextFormatter;\n  this.formatter_.showAbsoluteTime = false;\n  this.formatter_.showExceptionText = false;\n  this.formatter_.appendNewline = false;\n  this.isCapturing_ = false;\n  this.logBuffer_ = \"\";\n  this.filteredLoggers_ = {};\n};\ngoog.debug.Console.prototype.getFormatter = function() {\n  return this.formatter_;\n};\ngoog.debug.Console.prototype.setCapturing = function(capturing) {\n  if (capturing == this.isCapturing_) {\n    return;\n  }\n  var rootLogger = goog.debug.LogManager.getRoot();\n  if (capturing) {\n    rootLogger.addHandler(this.publishHandler_);\n  } else {\n    rootLogger.removeHandler(this.publishHandler_);\n  }\n  this.isCapturing_ = capturing;\n};\ngoog.debug.Console.prototype.addLogRecord = function(logRecord) {\n  if (this.filteredLoggers_[logRecord.getLoggerName()]) {\n    return;\n  }\n  function getConsoleMethodName_(level) {\n    if (level) {\n      if (level.value >= goog.debug.Logger.Level.SEVERE.value) {\n        return \"error\";\n      }\n      if (level.value >= goog.debug.Logger.Level.WARNING.value) {\n        return \"warn\";\n      }\n      if (level.value >= goog.debug.Logger.Level.CONFIG.value) {\n        return \"log\";\n      }\n    }\n    return \"debug\";\n  }\n  var record = this.formatter_.formatRecord(logRecord);\n  var console = goog.debug.Console.console_;\n  if (console) {\n    var logMethod = getConsoleMethodName_(logRecord.getLevel());\n    goog.debug.Console.logToConsole_(console, logMethod, record, logRecord.getException());\n  } else {\n    this.logBuffer_ += record;\n  }\n};\ngoog.debug.Console.prototype.addFilter = function(loggerName) {\n  this.filteredLoggers_[loggerName] = true;\n};\ngoog.debug.Console.prototype.removeFilter = function(loggerName) {\n  delete this.filteredLoggers_[loggerName];\n};\ngoog.debug.Console.instance = null;\ngoog.debug.Console.console_ = goog.global[\"console\"];\ngoog.debug.Console.setConsole = function(console) {\n  goog.debug.Console.console_ = console;\n};\ngoog.debug.Console.autoInstall = function() {\n  if (!goog.debug.Console.instance) {\n    goog.debug.Console.instance = new goog.debug.Console;\n  }\n  if (goog.global.location && goog.global.location.href.indexOf(\"Debug\\x3dtrue\") != -1) {\n    goog.debug.Console.instance.setCapturing(true);\n  }\n};\ngoog.debug.Console.show = function() {\n  alert(goog.debug.Console.instance.logBuffer_);\n};\ngoog.debug.Console.logToConsole_ = function(console, fnName, record, exception) {\n  if (console[fnName]) {\n    console[fnName](record, exception || \"\");\n  } else {\n    console.log(record, exception || \"\");\n  }\n};\n","~:source","// Copyright 2006 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview Simple logger that logs to the window console if available.\n *\n * Has an autoInstall option which can be put into initialization code, which\n * will start logging if \"Debug=true\" is in document.location.href\n *\n */\n\ngoog.provide('goog.debug.Console');\n\ngoog.require('goog.debug.LogManager');\ngoog.require('goog.debug.Logger');\ngoog.require('goog.debug.TextFormatter');\n\n\n\n/**\n * Create and install a log handler that logs to window.console if available\n * @constructor\n */\ngoog.debug.Console = function() {\n  this.publishHandler_ = goog.bind(this.addLogRecord, this);\n\n  /**\n   * Formatter for formatted output.\n   * @type {!goog.debug.TextFormatter}\n   * @private\n   */\n  this.formatter_ = new goog.debug.TextFormatter();\n  this.formatter_.showAbsoluteTime = false;\n  this.formatter_.showExceptionText = false;\n  // The console logging methods automatically append a newline.\n  this.formatter_.appendNewline = false;\n\n  this.isCapturing_ = false;\n  this.logBuffer_ = '';\n\n  /**\n   * Loggers that we shouldn't output.\n   * @type {!Object<boolean>}\n   * @private\n   */\n  this.filteredLoggers_ = {};\n};\n\n\n/**\n * Returns the text formatter used by this console\n * @return {!goog.debug.TextFormatter} The text formatter.\n */\ngoog.debug.Console.prototype.getFormatter = function() {\n  return this.formatter_;\n};\n\n\n/**\n * Sets whether we are currently capturing logger output.\n * @param {boolean} capturing Whether to capture logger output.\n */\ngoog.debug.Console.prototype.setCapturing = function(capturing) {\n  if (capturing == this.isCapturing_) {\n    return;\n  }\n\n  // attach or detach handler from the root logger\n  var rootLogger = goog.debug.LogManager.getRoot();\n  if (capturing) {\n    rootLogger.addHandler(this.publishHandler_);\n  } else {\n    rootLogger.removeHandler(this.publishHandler_);\n  }\n  this.isCapturing_ = capturing;\n};\n\n\n/**\n * Adds a log record.\n * @param {?goog.debug.LogRecord} logRecord The log entry.\n */\ngoog.debug.Console.prototype.addLogRecord = function(logRecord) {\n  // Check to see if the log record is filtered or not.\n  if (this.filteredLoggers_[logRecord.getLoggerName()]) {\n    return;\n  }\n\n  /**\n   * @param {?goog.debug.Logger.Level} level\n   * @return {string}\n   */\n  function getConsoleMethodName_(level) {\n    if (level) {\n      if (level.value >= goog.debug.Logger.Level.SEVERE.value) {\n        // SEVERE == 1000, SHOUT == 1200\n        return 'error';\n      }\n      if (level.value >= goog.debug.Logger.Level.WARNING.value) {\n        return 'warn';\n      }\n      // NOTE(martone): there's a goog.debug.Logger.Level.INFO - that we should\n      // presumably map to console.info. However, the current mapping is INFO ->\n      // console.log. Let's keep the status quo for now, but we should\n      // reevaluate if we tweak the goog.log API.\n      if (level.value >= goog.debug.Logger.Level.CONFIG.value) {\n        return 'log';\n      }\n    }\n    return 'debug';\n  }\n\n  var record = this.formatter_.formatRecord(logRecord);\n  var console = goog.debug.Console.console_;\n  if (console) {\n    // TODO(b/117415985): Make getLevel() non-null and update\n    // getConsoleMethodName_ parameters.\n    var logMethod = getConsoleMethodName_(logRecord.getLevel());\n    goog.debug.Console.logToConsole_(\n        console, logMethod, record, logRecord.getException());\n  } else {\n    this.logBuffer_ += record;\n  }\n};\n\n\n/**\n * Adds a logger name to be filtered.\n * @param {string} loggerName the logger name to add.\n */\ngoog.debug.Console.prototype.addFilter = function(loggerName) {\n  this.filteredLoggers_[loggerName] = true;\n};\n\n\n/**\n * Removes a logger name to be filtered.\n * @param {string} loggerName the logger name to remove.\n */\ngoog.debug.Console.prototype.removeFilter = function(loggerName) {\n  delete this.filteredLoggers_[loggerName];\n};\n\n\n/**\n * Global console logger instance\n * @type {?goog.debug.Console}\n */\ngoog.debug.Console.instance = null;\n\n\n/**\n * The console to which to log.  This is a property so it can be mocked out in\n * this unit test for goog.debug.Console. Using goog.global, as console might be\n * used in window-less contexts.\n * @type {{log:!Function}}\n * @private\n */\ngoog.debug.Console.console_ = goog.global['console'];\n\n\n/**\n * Sets the console to which to log.\n * @param {!Object} console The console to which to log.\n */\ngoog.debug.Console.setConsole = function(console) {\n  goog.debug.Console.console_ = /** @type {{log:!Function}} */ (console);\n};\n\n\n/**\n * Install the console and start capturing if \"Debug=true\" is in the page URL\n */\ngoog.debug.Console.autoInstall = function() {\n  if (!goog.debug.Console.instance) {\n    goog.debug.Console.instance = new goog.debug.Console();\n  }\n\n  if (goog.global.location &&\n      goog.global.location.href.indexOf('Debug=true') != -1) {\n    goog.debug.Console.instance.setCapturing(true);\n  }\n};\n\n\n/**\n * Show an alert with all of the captured debug information.\n * Information is only captured if console is not available\n */\ngoog.debug.Console.show = function() {\n  alert(goog.debug.Console.instance.logBuffer_);\n};\n\n\n/**\n * Logs the record to the console using the given function.  If the function is\n * not available on the console object, the log function is used instead.\n * @param {{log:!Function}} console The console object.\n * @param {string} fnName The name of the function to use.\n * @param {string} record The record to log.\n * @param {?Object} exception An additional Error to log.\n * @private\n */\ngoog.debug.Console.logToConsole_ = function(\n    console, fnName, record, exception) {\n  if (console[fnName]) {\n    console[fnName](record, exception || '');\n  } else {\n    console.log(record, exception || '');\n  }\n};\n","~:compiled-at",1636626309875,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.debug.console.js\",\n\"lineCount\":86,\n\"mappings\":\"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\",\n\"sources\":[\"goog/debug/console.js\"],\n\"sourcesContent\":[\"// Copyright 2006 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview Simple logger that logs to the window console if available.\\n *\\n * Has an autoInstall option which can be put into initialization code, which\\n * will start logging if \\\"Debug=true\\\" is in document.location.href\\n *\\n */\\n\\ngoog.provide('goog.debug.Console');\\n\\ngoog.require('goog.debug.LogManager');\\ngoog.require('goog.debug.Logger');\\ngoog.require('goog.debug.TextFormatter');\\n\\n\\n\\n/**\\n * Create and install a log handler that logs to window.console if available\\n * @constructor\\n */\\ngoog.debug.Console = function() {\\n  this.publishHandler_ = goog.bind(this.addLogRecord, this);\\n\\n  /**\\n   * Formatter for formatted output.\\n   * @type {!goog.debug.TextFormatter}\\n   * @private\\n   */\\n  this.formatter_ = new goog.debug.TextFormatter();\\n  this.formatter_.showAbsoluteTime = false;\\n  this.formatter_.showExceptionText = false;\\n  // The console logging methods automatically append a newline.\\n  this.formatter_.appendNewline = false;\\n\\n  this.isCapturing_ = false;\\n  this.logBuffer_ = '';\\n\\n  /**\\n   * Loggers that we shouldn't output.\\n   * @type {!Object<boolean>}\\n   * @private\\n   */\\n  this.filteredLoggers_ = {};\\n};\\n\\n\\n/**\\n * Returns the text formatter used by this console\\n * @return {!goog.debug.TextFormatter} The text formatter.\\n */\\ngoog.debug.Console.prototype.getFormatter = function() {\\n  return this.formatter_;\\n};\\n\\n\\n/**\\n * Sets whether we are currently capturing logger output.\\n * @param {boolean} capturing Whether to capture logger output.\\n */\\ngoog.debug.Console.prototype.setCapturing = function(capturing) {\\n  if (capturing == this.isCapturing_) {\\n    return;\\n  }\\n\\n  // attach or detach handler from the root logger\\n  var rootLogger = goog.debug.LogManager.getRoot();\\n  if (capturing) {\\n    rootLogger.addHandler(this.publishHandler_);\\n  } else {\\n    rootLogger.removeHandler(this.publishHandler_);\\n  }\\n  this.isCapturing_ = capturing;\\n};\\n\\n\\n/**\\n * Adds a log record.\\n * @param {?goog.debug.LogRecord} logRecord The log entry.\\n */\\ngoog.debug.Console.prototype.addLogRecord = function(logRecord) {\\n  // Check to see if the log record is filtered or not.\\n  if (this.filteredLoggers_[logRecord.getLoggerName()]) {\\n    return;\\n  }\\n\\n  /**\\n   * @param {?goog.debug.Logger.Level} level\\n   * @return {string}\\n   */\\n  function getConsoleMethodName_(level) {\\n    if (level) {\\n      if (level.value >= goog.debug.Logger.Level.SEVERE.value) {\\n        // SEVERE == 1000, SHOUT == 1200\\n        return 'error';\\n      }\\n      if (level.value >= goog.debug.Logger.Level.WARNING.value) {\\n        return 'warn';\\n      }\\n      // NOTE(martone): there's a goog.debug.Logger.Level.INFO - that we should\\n      // presumably map to console.info. However, the current mapping is INFO ->\\n      // console.log. Let's keep the status quo for now, but we should\\n      // reevaluate if we tweak the goog.log API.\\n      if (level.value >= goog.debug.Logger.Level.CONFIG.value) {\\n        return 'log';\\n      }\\n    }\\n    return 'debug';\\n  }\\n\\n  var record = this.formatter_.formatRecord(logRecord);\\n  var console = goog.debug.Console.console_;\\n  if (console) {\\n    // TODO(b/117415985): Make getLevel() non-null and update\\n    // getConsoleMethodName_ parameters.\\n    var logMethod = getConsoleMethodName_(logRecord.getLevel());\\n    goog.debug.Console.logToConsole_(\\n        console, logMethod, record, logRecord.getException());\\n  } else {\\n    this.logBuffer_ += record;\\n  }\\n};\\n\\n\\n/**\\n * Adds a logger name to be filtered.\\n * @param {string} loggerName the logger name to add.\\n */\\ngoog.debug.Console.prototype.addFilter = function(loggerName) {\\n  this.filteredLoggers_[loggerName] = true;\\n};\\n\\n\\n/**\\n * Removes a logger name to be filtered.\\n * @param {string} loggerName the logger name to remove.\\n */\\ngoog.debug.Console.prototype.removeFilter = function(loggerName) {\\n  delete this.filteredLoggers_[loggerName];\\n};\\n\\n\\n/**\\n * Global console logger instance\\n * @type {?goog.debug.Console}\\n */\\ngoog.debug.Console.instance = null;\\n\\n\\n/**\\n * The console to which to log.  This is a property so it can be mocked out in\\n * this unit test for goog.debug.Console. Using goog.global, as console might be\\n * used in window-less contexts.\\n * @type {{log:!Function}}\\n * @private\\n */\\ngoog.debug.Console.console_ = goog.global['console'];\\n\\n\\n/**\\n * Sets the console to which to log.\\n * @param {!Object} console The console to which to log.\\n */\\ngoog.debug.Console.setConsole = function(console) {\\n  goog.debug.Console.console_ = /** @type {{log:!Function}} */ (console);\\n};\\n\\n\\n/**\\n * Install the console and start capturing if \\\"Debug=true\\\" is in the page URL\\n */\\ngoog.debug.Console.autoInstall = function() {\\n  if (!goog.debug.Console.instance) {\\n    goog.debug.Console.instance = new goog.debug.Console();\\n  }\\n\\n  if (goog.global.location &&\\n      goog.global.location.href.indexOf('Debug=true') != -1) {\\n    goog.debug.Console.instance.setCapturing(true);\\n  }\\n};\\n\\n\\n/**\\n * Show an alert with all of the captured debug information.\\n * Information is only captured if console is not available\\n */\\ngoog.debug.Console.show = function() {\\n  alert(goog.debug.Console.instance.logBuffer_);\\n};\\n\\n\\n/**\\n * Logs the record to the console using the given function.  If the function is\\n * not available on the console object, the log function is used instead.\\n * @param {{log:!Function}} console The console object.\\n * @param {string} fnName The name of the function to use.\\n * @param {string} record The record to log.\\n * @param {?Object} exception An additional Error to log.\\n * @private\\n */\\ngoog.debug.Console.logToConsole_ = function(\\n    console, fnName, record, exception) {\\n  if (console[fnName]) {\\n    console[fnName](record, exception || '');\\n  } else {\\n    console.log(record, exception || '');\\n  }\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"debug\",\"Console\",\"goog.debug.Console\",\"publishHandler_\",\"bind\",\"addLogRecord\",\"formatter_\",\"TextFormatter\",\"showAbsoluteTime\",\"showExceptionText\",\"appendNewline\",\"isCapturing_\",\"logBuffer_\",\"filteredLoggers_\",\"prototype\",\"getFormatter\",\"goog.debug.Console.prototype.getFormatter\",\"setCapturing\",\"goog.debug.Console.prototype.setCapturing\",\"capturing\",\"rootLogger\",\"LogManager\",\"getRoot\",\"addHandler\",\"removeHandler\",\"goog.debug.Console.prototype.addLogRecord\",\"logRecord\",\"getLoggerName\",\"getConsoleMethodName_\",\"level\",\"value\",\"Logger\",\"Level\",\"SEVERE\",\"WARNING\",\"CONFIG\",\"record\",\"formatRecord\",\"console\",\"console_\",\"logMethod\",\"getLevel\",\"logToConsole_\",\"getException\",\"addFilter\",\"goog.debug.Console.prototype.addFilter\",\"loggerName\",\"removeFilter\",\"goog.debug.Console.prototype.removeFilter\",\"instance\",\"global\",\"setConsole\",\"goog.debug.Console.setConsole\",\"autoInstall\",\"goog.debug.Console.autoInstall\",\"location\",\"href\",\"indexOf\",\"show\",\"goog.debug.Console.show\",\"alert\",\"goog.debug.Console.logToConsole_\",\"fnName\",\"exception\",\"log\"]\n}\n"]