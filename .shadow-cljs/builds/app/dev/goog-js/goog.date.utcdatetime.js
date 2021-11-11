["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/date/utcdatetime.js"],"~:js","goog.provide(\"goog.date.UtcDateTime\");\ngoog.require(\"goog.date\");\ngoog.require(\"goog.date.Date\");\ngoog.require(\"goog.date.DateTime\");\ngoog.require(\"goog.date.Interval\");\ngoog.date.UtcDateTime = function(opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds, opt_milliseconds) {\n  var timestamp;\n  if (typeof opt_year === \"number\") {\n    timestamp = Date.UTC(opt_year, opt_month || 0, opt_date || 1, opt_hours || 0, opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0);\n  } else {\n    timestamp = opt_year ? opt_year.getTime() : goog.now();\n  }\n  this.date = new Date(timestamp);\n};\ngoog.inherits(goog.date.UtcDateTime, goog.date.DateTime);\ngoog.date.UtcDateTime.fromTimestamp = function(timestamp) {\n  var date = new goog.date.UtcDateTime;\n  date.setTime(timestamp);\n  return date;\n};\ngoog.date.UtcDateTime.fromIsoString = function(formatted) {\n  var ret = new goog.date.UtcDateTime(2000);\n  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;\n};\ngoog.date.UtcDateTime.prototype.clone = function() {\n  var date = new goog.date.UtcDateTime(this.date);\n  date.setFirstDayOfWeek(this.getFirstDayOfWeek());\n  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());\n  return date;\n};\ngoog.date.UtcDateTime.prototype.add = function(interval) {\n  if (interval.years || interval.months) {\n    var yearsMonths = new goog.date.Interval(interval.years, interval.months);\n    goog.date.Date.prototype.add.call(this, yearsMonths);\n  }\n  var daysAndTimeMillis = 1000 * (interval.seconds + 60 * (interval.minutes + 60 * (interval.hours + 24 * interval.days)));\n  this.date = new Date(this.date.getTime() + daysAndTimeMillis);\n};\ngoog.date.UtcDateTime.prototype.getTimezoneOffset = function() {\n  return 0;\n};\ngoog.date.UtcDateTime.prototype.getFullYear = goog.date.DateTime.prototype.getUTCFullYear;\ngoog.date.UtcDateTime.prototype.getMonth = goog.date.DateTime.prototype.getUTCMonth;\ngoog.date.UtcDateTime.prototype.getDate = goog.date.DateTime.prototype.getUTCDate;\ngoog.date.UtcDateTime.prototype.getHours = goog.date.DateTime.prototype.getUTCHours;\ngoog.date.UtcDateTime.prototype.getMinutes = goog.date.DateTime.prototype.getUTCMinutes;\ngoog.date.UtcDateTime.prototype.getSeconds = goog.date.DateTime.prototype.getUTCSeconds;\ngoog.date.UtcDateTime.prototype.getMilliseconds = goog.date.DateTime.prototype.getUTCMilliseconds;\ngoog.date.UtcDateTime.prototype.getDay = goog.date.DateTime.prototype.getUTCDay;\ngoog.date.UtcDateTime.prototype.setFullYear = goog.date.DateTime.prototype.setUTCFullYear;\ngoog.date.UtcDateTime.prototype.setMonth = goog.date.DateTime.prototype.setUTCMonth;\ngoog.date.UtcDateTime.prototype.setDate = goog.date.DateTime.prototype.setUTCDate;\ngoog.date.UtcDateTime.prototype.setHours = goog.date.DateTime.prototype.setUTCHours;\ngoog.date.UtcDateTime.prototype.setMinutes = goog.date.DateTime.prototype.setUTCMinutes;\ngoog.date.UtcDateTime.prototype.setSeconds = goog.date.DateTime.prototype.setUTCSeconds;\ngoog.date.UtcDateTime.prototype.setMilliseconds = goog.date.DateTime.prototype.setUTCMilliseconds;\n","~:source","// Copyright 2009 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview Locale independent date/time class.\n *\n */\n\ngoog.provide('goog.date.UtcDateTime');\n\ngoog.require('goog.date');\ngoog.require('goog.date.Date');\ngoog.require('goog.date.DateTime');\ngoog.require('goog.date.Interval');\n\n\n\n/**\n * Class representing a date/time in GMT+0 time zone, without daylight saving.\n * Defaults to current date and time if none is specified. The get... and the\n * getUTC... methods are equivalent.\n *\n * @param {number|goog.date.DateLike=} opt_year Four digit UTC year or a\n *     date-like object.  If not set, the created object will contain the\n *     date determined by goog.now().\n * @param {number=} opt_month UTC month, 0 = Jan, 11 = Dec.\n * @param {number=} opt_date UTC date of month, 1 - 31.\n * @param {number=} opt_hours UTC hours, 0 - 23.\n * @param {number=} opt_minutes UTC minutes, 0 - 59.\n * @param {number=} opt_seconds UTC seconds, 0 - 59.\n * @param {number=} opt_milliseconds UTC milliseconds, 0 - 999.\n * @constructor\n * @struct\n * @extends {goog.date.DateTime}\n */\ngoog.date.UtcDateTime = function(\n    opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds,\n    opt_milliseconds) {\n  var timestamp;\n  if (typeof opt_year === 'number') {\n    timestamp = Date.UTC(\n        opt_year, opt_month || 0, opt_date || 1, opt_hours || 0,\n        opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0);\n  } else {\n    timestamp = opt_year ? opt_year.getTime() : goog.now();\n  }\n  /** @override */\n  this.date = new Date(timestamp);\n};\ngoog.inherits(goog.date.UtcDateTime, goog.date.DateTime);\n\n\n/**\n * @param {number} timestamp Number of milliseconds since Epoch.\n * @return {!goog.date.UtcDateTime}\n */\ngoog.date.UtcDateTime.fromTimestamp = function(timestamp) {\n  var date = new goog.date.UtcDateTime();\n  date.setTime(timestamp);\n  return date;\n};\n\n\n/**\n * Creates a DateTime from a UTC datetime string expressed in ISO 8601 format.\n *\n * @param {string} formatted A date or datetime expressed in ISO 8601 format.\n * @return {goog.date.UtcDateTime} Parsed date or null if parse fails.\n */\ngoog.date.UtcDateTime.fromIsoString = function(formatted) {\n  var ret = new goog.date.UtcDateTime(2000);\n  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;\n};\n\n\n/**\n * Clones the UtcDateTime object.\n *\n * @return {!goog.date.UtcDateTime} A clone of the datetime object.\n * @override\n */\ngoog.date.UtcDateTime.prototype.clone = function() {\n  var date = new goog.date.UtcDateTime(this.date);\n  date.setFirstDayOfWeek(this.getFirstDayOfWeek());\n  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());\n  return date;\n};\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.add = function(interval) {\n  if (interval.years || interval.months) {\n    var yearsMonths = new goog.date.Interval(interval.years, interval.months);\n    goog.date.Date.prototype.add.call(this, yearsMonths);\n  }\n  var daysAndTimeMillis = 1000 *\n      (interval.seconds +\n       60 * (interval.minutes + 60 * (interval.hours + 24 * interval.days)));\n  this.date = new Date(this.date.getTime() + daysAndTimeMillis);\n};\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getTimezoneOffset = function() {\n  return 0;\n};\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getFullYear =\n    goog.date.DateTime.prototype.getUTCFullYear;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getMonth =\n    goog.date.DateTime.prototype.getUTCMonth;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getDate =\n    goog.date.DateTime.prototype.getUTCDate;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getHours =\n    goog.date.DateTime.prototype.getUTCHours;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getMinutes =\n    goog.date.DateTime.prototype.getUTCMinutes;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getSeconds =\n    goog.date.DateTime.prototype.getUTCSeconds;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getMilliseconds =\n    goog.date.DateTime.prototype.getUTCMilliseconds;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.getDay = goog.date.DateTime.prototype.getUTCDay;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setFullYear =\n    goog.date.DateTime.prototype.setUTCFullYear;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setMonth =\n    goog.date.DateTime.prototype.setUTCMonth;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setDate =\n    goog.date.DateTime.prototype.setUTCDate;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setHours =\n    goog.date.DateTime.prototype.setUTCHours;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setMinutes =\n    goog.date.DateTime.prototype.setUTCMinutes;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setSeconds =\n    goog.date.DateTime.prototype.setUTCSeconds;\n\n\n/** @override */\ngoog.date.UtcDateTime.prototype.setMilliseconds =\n    goog.date.DateTime.prototype.setUTCMilliseconds;\n","~:compiled-at",1636626309838,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.date.utcdatetime.js\",\n\"lineCount\":57,\n\"mappings\":\"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\",\n\"sources\":[\"goog/date/utcdatetime.js\"],\n\"sourcesContent\":[\"// Copyright 2009 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview Locale independent date/time class.\\n *\\n */\\n\\ngoog.provide('goog.date.UtcDateTime');\\n\\ngoog.require('goog.date');\\ngoog.require('goog.date.Date');\\ngoog.require('goog.date.DateTime');\\ngoog.require('goog.date.Interval');\\n\\n\\n\\n/**\\n * Class representing a date/time in GMT+0 time zone, without daylight saving.\\n * Defaults to current date and time if none is specified. The get... and the\\n * getUTC... methods are equivalent.\\n *\\n * @param {number|goog.date.DateLike=} opt_year Four digit UTC year or a\\n *     date-like object.  If not set, the created object will contain the\\n *     date determined by goog.now().\\n * @param {number=} opt_month UTC month, 0 = Jan, 11 = Dec.\\n * @param {number=} opt_date UTC date of month, 1 - 31.\\n * @param {number=} opt_hours UTC hours, 0 - 23.\\n * @param {number=} opt_minutes UTC minutes, 0 - 59.\\n * @param {number=} opt_seconds UTC seconds, 0 - 59.\\n * @param {number=} opt_milliseconds UTC milliseconds, 0 - 999.\\n * @constructor\\n * @struct\\n * @extends {goog.date.DateTime}\\n */\\ngoog.date.UtcDateTime = function(\\n    opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds,\\n    opt_milliseconds) {\\n  var timestamp;\\n  if (typeof opt_year === 'number') {\\n    timestamp = Date.UTC(\\n        opt_year, opt_month || 0, opt_date || 1, opt_hours || 0,\\n        opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0);\\n  } else {\\n    timestamp = opt_year ? opt_year.getTime() : goog.now();\\n  }\\n  /** @override */\\n  this.date = new Date(timestamp);\\n};\\ngoog.inherits(goog.date.UtcDateTime, goog.date.DateTime);\\n\\n\\n/**\\n * @param {number} timestamp Number of milliseconds since Epoch.\\n * @return {!goog.date.UtcDateTime}\\n */\\ngoog.date.UtcDateTime.fromTimestamp = function(timestamp) {\\n  var date = new goog.date.UtcDateTime();\\n  date.setTime(timestamp);\\n  return date;\\n};\\n\\n\\n/**\\n * Creates a DateTime from a UTC datetime string expressed in ISO 8601 format.\\n *\\n * @param {string} formatted A date or datetime expressed in ISO 8601 format.\\n * @return {goog.date.UtcDateTime} Parsed date or null if parse fails.\\n */\\ngoog.date.UtcDateTime.fromIsoString = function(formatted) {\\n  var ret = new goog.date.UtcDateTime(2000);\\n  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;\\n};\\n\\n\\n/**\\n * Clones the UtcDateTime object.\\n *\\n * @return {!goog.date.UtcDateTime} A clone of the datetime object.\\n * @override\\n */\\ngoog.date.UtcDateTime.prototype.clone = function() {\\n  var date = new goog.date.UtcDateTime(this.date);\\n  date.setFirstDayOfWeek(this.getFirstDayOfWeek());\\n  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());\\n  return date;\\n};\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.add = function(interval) {\\n  if (interval.years || interval.months) {\\n    var yearsMonths = new goog.date.Interval(interval.years, interval.months);\\n    goog.date.Date.prototype.add.call(this, yearsMonths);\\n  }\\n  var daysAndTimeMillis = 1000 *\\n      (interval.seconds +\\n       60 * (interval.minutes + 60 * (interval.hours + 24 * interval.days)));\\n  this.date = new Date(this.date.getTime() + daysAndTimeMillis);\\n};\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getTimezoneOffset = function() {\\n  return 0;\\n};\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getFullYear =\\n    goog.date.DateTime.prototype.getUTCFullYear;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getMonth =\\n    goog.date.DateTime.prototype.getUTCMonth;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getDate =\\n    goog.date.DateTime.prototype.getUTCDate;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getHours =\\n    goog.date.DateTime.prototype.getUTCHours;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getMinutes =\\n    goog.date.DateTime.prototype.getUTCMinutes;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getSeconds =\\n    goog.date.DateTime.prototype.getUTCSeconds;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getMilliseconds =\\n    goog.date.DateTime.prototype.getUTCMilliseconds;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.getDay = goog.date.DateTime.prototype.getUTCDay;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setFullYear =\\n    goog.date.DateTime.prototype.setUTCFullYear;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setMonth =\\n    goog.date.DateTime.prototype.setUTCMonth;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setDate =\\n    goog.date.DateTime.prototype.setUTCDate;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setHours =\\n    goog.date.DateTime.prototype.setUTCHours;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setMinutes =\\n    goog.date.DateTime.prototype.setUTCMinutes;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setSeconds =\\n    goog.date.DateTime.prototype.setUTCSeconds;\\n\\n\\n/** @override */\\ngoog.date.UtcDateTime.prototype.setMilliseconds =\\n    goog.date.DateTime.prototype.setUTCMilliseconds;\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"date\",\"UtcDateTime\",\"goog.date.UtcDateTime\",\"opt_year\",\"opt_month\",\"opt_date\",\"opt_hours\",\"opt_minutes\",\"opt_seconds\",\"opt_milliseconds\",\"timestamp\",\"Date\",\"UTC\",\"getTime\",\"now\",\"inherits\",\"DateTime\",\"fromTimestamp\",\"goog.date.UtcDateTime.fromTimestamp\",\"setTime\",\"fromIsoString\",\"goog.date.UtcDateTime.fromIsoString\",\"formatted\",\"ret\",\"setIso8601DateTime\",\"prototype\",\"clone\",\"goog.date.UtcDateTime.prototype.clone\",\"setFirstDayOfWeek\",\"getFirstDayOfWeek\",\"setFirstWeekCutOffDay\",\"getFirstWeekCutOffDay\",\"add\",\"goog.date.UtcDateTime.prototype.add\",\"interval\",\"years\",\"months\",\"yearsMonths\",\"Interval\",\"call\",\"daysAndTimeMillis\",\"seconds\",\"minutes\",\"hours\",\"days\",\"getTimezoneOffset\",\"goog.date.UtcDateTime.prototype.getTimezoneOffset\",\"getFullYear\",\"getUTCFullYear\",\"getMonth\",\"getUTCMonth\",\"getDate\",\"getUTCDate\",\"getHours\",\"getUTCHours\",\"getMinutes\",\"getUTCMinutes\",\"getSeconds\",\"getUTCSeconds\",\"getMilliseconds\",\"getUTCMilliseconds\",\"getDay\",\"getUTCDay\",\"setFullYear\",\"setUTCFullYear\",\"setMonth\",\"setUTCMonth\",\"setDate\",\"setUTCDate\",\"setHours\",\"setUTCHours\",\"setMinutes\",\"setUTCMinutes\",\"setSeconds\",\"setUTCSeconds\",\"setMilliseconds\",\"setUTCMilliseconds\"]\n}\n"]