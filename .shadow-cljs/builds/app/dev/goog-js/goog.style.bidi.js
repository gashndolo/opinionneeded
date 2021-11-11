["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/style/bidi.js"],"~:js","goog.provide(\"goog.style.bidi\");\ngoog.require(\"goog.dom\");\ngoog.require(\"goog.style\");\ngoog.require(\"goog.userAgent\");\ngoog.require(\"goog.userAgent.platform\");\ngoog.require(\"goog.userAgent.product\");\ngoog.require(\"goog.userAgent.product.isVersion\");\ngoog.style.bidi.getScrollLeft = function(element) {\n  var isRtl = goog.style.isRightToLeft(element);\n  if (isRtl && goog.style.bidi.usesNegativeScrollLeftInRtl_()) {\n    return -element.scrollLeft;\n  } else {\n    if (isRtl && !(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher(\"8\"))) {\n      var overflowX = goog.style.getComputedOverflowX(element);\n      if (overflowX == \"visible\") {\n        return element.scrollLeft;\n      } else {\n        return element.scrollWidth - element.clientWidth - element.scrollLeft;\n      }\n    }\n  }\n  return element.scrollLeft;\n};\ngoog.style.bidi.getOffsetStart = function(element) {\n  element = element;\n  var offsetLeftForReal = element.offsetLeft;\n  var bestParent = element.offsetParent;\n  if (!bestParent && goog.style.getComputedPosition(element) == \"fixed\") {\n    bestParent = goog.dom.getOwnerDocument(element).documentElement;\n  }\n  if (!bestParent) {\n    return offsetLeftForReal;\n  }\n  if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(58)) {\n    var borderWidths = goog.style.getBorderBox(bestParent);\n    offsetLeftForReal += borderWidths.left;\n  } else {\n    if (goog.userAgent.isDocumentModeOrHigher(8) && !goog.userAgent.isDocumentModeOrHigher(9)) {\n      var borderWidths = goog.style.getBorderBox(bestParent);\n      offsetLeftForReal -= borderWidths.left;\n    }\n  }\n  if (goog.style.isRightToLeft(bestParent)) {\n    var elementRightOffset = offsetLeftForReal + element.offsetWidth;\n    return bestParent.clientWidth - elementRightOffset;\n  }\n  return offsetLeftForReal;\n};\ngoog.style.bidi.setScrollOffset = function(element, offsetStart) {\n  offsetStart = Math.max(offsetStart, 0);\n  if (!goog.style.isRightToLeft(element)) {\n    element.scrollLeft = offsetStart;\n  } else {\n    if (goog.style.bidi.usesNegativeScrollLeftInRtl_()) {\n      element.scrollLeft = -offsetStart;\n    } else {\n      if (!(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher(\"8\"))) {\n        element.scrollLeft = element.scrollWidth - offsetStart - element.clientWidth;\n      } else {\n        element.scrollLeft = offsetStart;\n      }\n    }\n  }\n};\ngoog.style.bidi.usesNegativeScrollLeftInRtl_ = function() {\n  var isSafari10Plus = goog.userAgent.product.SAFARI && goog.userAgent.product.isVersion(10);\n  var isIOS10Plus = goog.userAgent.IOS && goog.userAgent.platform.isVersion(10);\n  return goog.userAgent.GECKO || isSafari10Plus || isIOS10Plus;\n};\ngoog.style.bidi.setPosition = function(elem, left, top, isRtl) {\n  if (top !== null) {\n    elem.style.top = top + \"px\";\n  }\n  if (isRtl) {\n    elem.style.right = left + \"px\";\n    elem.style.left = \"\";\n  } else {\n    elem.style.left = left + \"px\";\n    elem.style.right = \"\";\n  }\n};\n","~:source","// Copyright 2012 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview Bidi utility functions.\n *\n */\n\ngoog.provide('goog.style.bidi');\n\ngoog.require('goog.dom');\ngoog.require('goog.style');\ngoog.require('goog.userAgent');\ngoog.require('goog.userAgent.platform');\ngoog.require('goog.userAgent.product');\ngoog.require('goog.userAgent.product.isVersion');\n\n\n/**\n * Returns the normalized scrollLeft position for a scrolled element.\n * @param {Element} element The scrolled element.\n * @return {number} The number of pixels the element is scrolled. 0 indicates\n *     that the element is not scrolled at all (which, in general, is the\n *     left-most position in ltr and the right-most position in rtl).\n */\ngoog.style.bidi.getScrollLeft = function(element) {\n  var isRtl = goog.style.isRightToLeft(element);\n  if (isRtl && goog.style.bidi.usesNegativeScrollLeftInRtl_()) {\n    return -element.scrollLeft;\n  } else if (\n      isRtl &&\n      !(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher('8'))) {\n    // ScrollLeft starts at the maximum positive value and decreases towards\n    // 0 as the element is scrolled towards the left. However, for overflow\n    // visible, there is no scrollLeft and the value always stays correctly at 0\n    var overflowX = goog.style.getComputedOverflowX(element);\n    if (overflowX == 'visible') {\n      return element.scrollLeft;\n    } else {\n      return element.scrollWidth - element.clientWidth - element.scrollLeft;\n    }\n  }\n  // ScrollLeft behavior is identical in rtl and ltr, it starts at 0 and\n  // increases as the element is scrolled away from the start.\n  return element.scrollLeft;\n};\n\n\n/**\n * Returns the \"offsetStart\" of an element, analogous to offsetLeft but\n * normalized for right-to-left environments and various browser\n * inconsistencies. This value returned can always be passed to setScrollOffset\n * to scroll to an element's left edge in a left-to-right offsetParent or\n * right edge in a right-to-left offsetParent.\n *\n * For example, here offsetStart is 10px in an LTR environment and 5px in RTL:\n *\n * <pre>\n * |          xxxxxxxxxx     |\n *  ^^^^^^^^^^   ^^^^   ^^^^^\n *     10px      elem    5px\n * </pre>\n *\n * If an element is positioned before the start of its offsetParent, the\n * startOffset may be negative.  This can be used with setScrollOffset to\n * reliably scroll to an element:\n *\n * <pre>\n * var scrollOffset = goog.style.bidi.getOffsetStart(element);\n * goog.style.bidi.setScrollOffset(element.offsetParent, scrollOffset);\n * </pre>\n *\n * @see setScrollOffset\n *\n * @param {Element} element The element for which we need to determine the\n *     offsetStart position.\n * @return {number} The offsetStart for that element.\n */\ngoog.style.bidi.getOffsetStart = function(element) {\n  element = /** @type {!HTMLElement} */ (element);\n  var offsetLeftForReal = element.offsetLeft;\n\n  // The element might not have an offsetParent.\n  // For example, the node might not be attached to the DOM tree,\n  // and position:fixed children do not have an offset parent.\n  // Just try to do the best we can with what we have.\n  var bestParent = element.offsetParent;\n\n  if (!bestParent && goog.style.getComputedPosition(element) == 'fixed') {\n    bestParent = goog.dom.getOwnerDocument(element).documentElement;\n  }\n\n  // Just give up in this case.\n  if (!bestParent) {\n    return offsetLeftForReal;\n  }\n\n  if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(58)) {\n    // When calculating an element's offsetLeft, Firefox 57 and below\n    // erroneously subtracts the border width from the actual distance.\n    // So we need to add it back. (Fixed in FireFox 58+)\n    var borderWidths = goog.style.getBorderBox(bestParent);\n    offsetLeftForReal += borderWidths.left;\n  } else if (\n      goog.userAgent.isDocumentModeOrHigher(8) &&\n      !goog.userAgent.isDocumentModeOrHigher(9)) {\n    // When calculating an element's offsetLeft, IE8/9-Standards Mode\n    // erroneously adds the border width to the actual distance.  So we need to\n    // subtract it.\n    var borderWidths = goog.style.getBorderBox(bestParent);\n    offsetLeftForReal -= borderWidths.left;\n  }\n\n  if (goog.style.isRightToLeft(bestParent)) {\n    // Right edge of the element relative to the left edge of its parent.\n    var elementRightOffset = offsetLeftForReal + element.offsetWidth;\n\n    // Distance from the parent's right edge to the element's right edge.\n    return bestParent.clientWidth - elementRightOffset;\n  }\n\n  return offsetLeftForReal;\n};\n\n\n/**\n * Sets the element's scrollLeft attribute so it is correctly scrolled by\n * offsetStart pixels.  This takes into account whether the element is RTL and\n * the nuances of different browsers.  To scroll to the \"beginning\" of an\n * element use getOffsetStart to obtain the element's offsetStart value and then\n * pass the value to setScrollOffset.\n * @see getOffsetStart\n * @param {Element} element The element to set scrollLeft on.\n * @param {number} offsetStart The number of pixels to scroll the element.\n *     If this value is < 0, 0 is used.\n */\ngoog.style.bidi.setScrollOffset = function(element, offsetStart) {\n  offsetStart = Math.max(offsetStart, 0);\n  // In LTR and in \"mirrored\" browser RTL (such as IE), we set scrollLeft to\n  // the number of pixels to scroll.\n  // Otherwise, in RTL, we need to account for different browser behavior.\n  if (!goog.style.isRightToLeft(element)) {\n    element.scrollLeft = offsetStart;\n  } else if (goog.style.bidi.usesNegativeScrollLeftInRtl_()) {\n    element.scrollLeft = -offsetStart;\n  } else if (\n      !(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher('8'))) {\n    // Take the current scrollLeft value and move to the right by the\n    // offsetStart to get to the left edge of the element, and then by\n    // the clientWidth of the element to get to the right edge.\n    element.scrollLeft =\n        element.scrollWidth - offsetStart - element.clientWidth;\n  } else {\n    element.scrollLeft = offsetStart;\n  }\n};\n\n\n/**\n * @return {boolean} Whether the current browser returns negative scrollLeft\n *     values for RTL elements. If true, then scrollLeft starts at 0 and then\n *     becomes more negative as the element is scrolled towards the left.\n * @private\n */\ngoog.style.bidi.usesNegativeScrollLeftInRtl_ = function() {\n  var isSafari10Plus =\n      goog.userAgent.product.SAFARI && goog.userAgent.product.isVersion(10);\n  var isIOS10Plus = goog.userAgent.IOS && goog.userAgent.platform.isVersion(10);\n  return goog.userAgent.GECKO || isSafari10Plus || isIOS10Plus;\n};\n\n\n/**\n * Sets the element's left style attribute in LTR or right style attribute in\n * RTL.  Also clears the left attribute in RTL and the right attribute in LTR.\n * @param {Element} elem The element to position.\n * @param {number} left The left position in LTR; will be set as right in RTL.\n * @param {?number} top The top position.  If null only the left/right is set.\n * @param {boolean} isRtl Whether we are in RTL mode.\n */\ngoog.style.bidi.setPosition = function(elem, left, top, isRtl) {\n  if (top !== null) {\n    elem.style.top = top + 'px';\n  }\n  if (isRtl) {\n    elem.style.right = left + 'px';\n    elem.style.left = '';\n  } else {\n    elem.style.left = left + 'px';\n    elem.style.right = '';\n  }\n};\n","~:compiled-at",1636626309716,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.style.bidi.js\",\n\"lineCount\":82,\n\"mappings\":\"AAmBAA,IAAA,CAAKC,OAAL,CAAa,iBAAb,CAAA;AAEAD,IAAA,CAAKE,OAAL,CAAa,UAAb,CAAA;AACAF,IAAA,CAAKE,OAAL,CAAa,YAAb,CAAA;AACAF,IAAA,CAAKE,OAAL,CAAa,gBAAb,CAAA;AACAF,IAAA,CAAKE,OAAL,CAAa,yBAAb,CAAA;AACAF,IAAA,CAAKE,OAAL,CAAa,wBAAb,CAAA;AACAF,IAAA,CAAKE,OAAL,CAAa,kCAAb,CAAA;AAUAF,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgBC,aAAhB,GAAgCC,QAAQ,CAACC,OAAD,CAAU;AAChD,MAAIC,QAAQR,IAAA,CAAKG,KAAL,CAAWM,aAAX,CAAyBF,OAAzB,CAAZ;AACA,MAAIC,KAAJ,IAAaR,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgBM,4BAAhB,EAAb;AACE,WAAO,CAACH,OAAD,CAASI,UAAhB;AADF;AAEO,QACHH,KADG,IAEH,EAAER,IAAF,CAAOY,SAAP,CAAiBC,UAAjB,IAA+Bb,IAAA,CAAKY,SAAL,CAAeE,iBAAf,CAAiC,GAAjC,CAA/B,CAFG,CAEoE;AAIzE,UAAIC,YAAYf,IAAA,CAAKG,KAAL,CAAWa,oBAAX,CAAgCT,OAAhC,CAAhB;AACA,UAAIQ,SAAJ,IAAiB,SAAjB;AACE,eAAOR,OAAP,CAAeI,UAAf;AADF;AAGE,eAAOJ,OAAP,CAAeU,WAAf,GAA6BV,OAA7B,CAAqCW,WAArC,GAAmDX,OAAnD,CAA2DI,UAA3D;AAHF;AALyE;AAJ3E;AAiBA,SAAOJ,OAAP,CAAeI,UAAf;AAnBgD,CAAlD;AAqDAX,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgBe,cAAhB,GAAiCC,QAAQ,CAACb,OAAD,CAAU;AACjDA,SAAA,GAAuCA,OAAvC;AACA,MAAIc,oBAAoBd,OAApBc,CAA4BC,UAAhC;AAMA,MAAIC,aAAahB,OAAbgB,CAAqBC,YAAzB;AAEA,MAAI,CAACD,UAAL,IAAmBvB,IAAA,CAAKG,KAAL,CAAWsB,mBAAX,CAA+BlB,OAA/B,CAAnB,IAA8D,OAA9D;AACEgB,cAAA,GAAavB,IAAA,CAAK0B,GAAL,CAASC,gBAAT,CAA0BpB,OAA1B,CAAb,CAAgDqB,eAAhD;AADF;AAKA,MAAI,CAACL,UAAL;AACE,WAAOF,iBAAP;AADF;AAIA,MAAIrB,IAAJ,CAASY,SAAT,CAAmBiB,KAAnB,IAA4B,CAAC7B,IAAA,CAAKY,SAAL,CAAeE,iBAAf,CAAiC,EAAjC,CAA7B,CAAmE;AAIjE,QAAIgB,eAAe9B,IAAA,CAAKG,KAAL,CAAW4B,YAAX,CAAwBR,UAAxB,CAAnB;AACAF,qBAAA,IAAqBS,YAArB,CAAkCE,IAAlC;AALiE,GAAnE;AAMO,QACHhC,IAAA,CAAKY,SAAL,CAAeqB,sBAAf,CAAsC,CAAtC,CADG,IAEH,CAACjC,IAAA,CAAKY,SAAL,CAAeqB,sBAAf,CAAsC,CAAtC,CAFE,CAEwC;AAI7C,UAAIH,eAAe9B,IAAA,CAAKG,KAAL,CAAW4B,YAAX,CAAwBR,UAAxB,CAAnB;AACAF,uBAAA,IAAqBS,YAArB,CAAkCE,IAAlC;AAL6C;AAR/C;AAgBA,MAAIhC,IAAA,CAAKG,KAAL,CAAWM,aAAX,CAAyBc,UAAzB,CAAJ,CAA0C;AAExC,QAAIW,qBAAqBb,iBAArBa,GAAyC3B,OAAzC2B,CAAiDC,WAArD;AAGA,WAAOZ,UAAP,CAAkBL,WAAlB,GAAgCgB,kBAAhC;AALwC;AAQ1C,SAAOb,iBAAP;AA3CiD,CAAnD;AA0DArB,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgBgC,eAAhB,GAAkCC,QAAQ,CAAC9B,OAAD,EAAU+B,WAAV,CAAuB;AAC/DA,aAAA,GAAcC,IAAA,CAAKC,GAAL,CAASF,WAAT,EAAsB,CAAtB,CAAd;AAIA,MAAI,CAACtC,IAAA,CAAKG,KAAL,CAAWM,aAAX,CAAyBF,OAAzB,CAAL;AACEA,WAAA,CAAQI,UAAR,GAAqB2B,WAArB;AADF;AAEO,QAAItC,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgBM,4BAAhB,EAAJ;AACLH,aAAA,CAAQI,UAAR,GAAqB,CAAC2B,WAAtB;AADK;AAEA,UACH,EAAEtC,IAAF,CAAOY,SAAP,CAAiBC,UAAjB,IAA+Bb,IAAA,CAAKY,SAAL,CAAeE,iBAAf,CAAiC,GAAjC,CAA/B,CADG;AAKLP,eAAA,CAAQI,UAAR,GACIJ,OADJ,CACYU,WADZ,GAC0BqB,WAD1B,GACwC/B,OADxC,CACgDW,WADhD;AALK;AAQLX,eAAA,CAAQI,UAAR,GAAqB2B,WAArB;AARK;AAFA;AAFP;AAL+D,CAAjE;AA4BAtC,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgBM,4BAAhB,GAA+C+B,QAAQ,EAAG;AACxD,MAAIC,iBACA1C,IADA0C,CACK9B,SADL8B,CACeC,OADfD,CACuBE,MADvBF,IACiC1C,IAAA,CAAKY,SAAL,CAAe+B,OAAf,CAAuBE,SAAvB,CAAiC,EAAjC,CADrC;AAEA,MAAIC,cAAc9C,IAAd8C,CAAmBlC,SAAnBkC,CAA6BC,GAA7BD,IAAoC9C,IAAA,CAAKY,SAAL,CAAeoC,QAAf,CAAwBH,SAAxB,CAAkC,EAAlC,CAAxC;AACA,SAAO7C,IAAP,CAAYY,SAAZ,CAAsBiB,KAAtB,IAA+Ba,cAA/B,IAAiDI,WAAjD;AAJwD,CAA1D;AAgBA9C,IAAA,CAAKG,KAAL,CAAWC,IAAX,CAAgB6C,WAAhB,GAA8BC,QAAQ,CAACC,IAAD,EAAOnB,IAAP,EAAaoB,GAAb,EAAkB5C,KAAlB,CAAyB;AAC7D,MAAI4C,GAAJ,KAAY,IAAZ;AACED,QAAA,CAAKhD,KAAL,CAAWiD,GAAX,GAAiBA,GAAjB,GAAuB,IAAvB;AADF;AAGA,MAAI5C,KAAJ,CAAW;AACT2C,QAAA,CAAKhD,KAAL,CAAWkD,KAAX,GAAmBrB,IAAnB,GAA0B,IAA1B;AACAmB,QAAA,CAAKhD,KAAL,CAAW6B,IAAX,GAAkB,EAAlB;AAFS,GAAX,KAGO;AACLmB,QAAA,CAAKhD,KAAL,CAAW6B,IAAX,GAAkBA,IAAlB,GAAyB,IAAzB;AACAmB,QAAA,CAAKhD,KAAL,CAAWkD,KAAX,GAAmB,EAAnB;AAFK;AAPsD,CAA/D;;\",\n\"sources\":[\"goog/style/bidi.js\"],\n\"sourcesContent\":[\"// Copyright 2012 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview Bidi utility functions.\\n *\\n */\\n\\ngoog.provide('goog.style.bidi');\\n\\ngoog.require('goog.dom');\\ngoog.require('goog.style');\\ngoog.require('goog.userAgent');\\ngoog.require('goog.userAgent.platform');\\ngoog.require('goog.userAgent.product');\\ngoog.require('goog.userAgent.product.isVersion');\\n\\n\\n/**\\n * Returns the normalized scrollLeft position for a scrolled element.\\n * @param {Element} element The scrolled element.\\n * @return {number} The number of pixels the element is scrolled. 0 indicates\\n *     that the element is not scrolled at all (which, in general, is the\\n *     left-most position in ltr and the right-most position in rtl).\\n */\\ngoog.style.bidi.getScrollLeft = function(element) {\\n  var isRtl = goog.style.isRightToLeft(element);\\n  if (isRtl && goog.style.bidi.usesNegativeScrollLeftInRtl_()) {\\n    return -element.scrollLeft;\\n  } else if (\\n      isRtl &&\\n      !(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher('8'))) {\\n    // ScrollLeft starts at the maximum positive value and decreases towards\\n    // 0 as the element is scrolled towards the left. However, for overflow\\n    // visible, there is no scrollLeft and the value always stays correctly at 0\\n    var overflowX = goog.style.getComputedOverflowX(element);\\n    if (overflowX == 'visible') {\\n      return element.scrollLeft;\\n    } else {\\n      return element.scrollWidth - element.clientWidth - element.scrollLeft;\\n    }\\n  }\\n  // ScrollLeft behavior is identical in rtl and ltr, it starts at 0 and\\n  // increases as the element is scrolled away from the start.\\n  return element.scrollLeft;\\n};\\n\\n\\n/**\\n * Returns the \\\"offsetStart\\\" of an element, analogous to offsetLeft but\\n * normalized for right-to-left environments and various browser\\n * inconsistencies. This value returned can always be passed to setScrollOffset\\n * to scroll to an element's left edge in a left-to-right offsetParent or\\n * right edge in a right-to-left offsetParent.\\n *\\n * For example, here offsetStart is 10px in an LTR environment and 5px in RTL:\\n *\\n * <pre>\\n * |          xxxxxxxxxx     |\\n *  ^^^^^^^^^^   ^^^^   ^^^^^\\n *     10px      elem    5px\\n * </pre>\\n *\\n * If an element is positioned before the start of its offsetParent, the\\n * startOffset may be negative.  This can be used with setScrollOffset to\\n * reliably scroll to an element:\\n *\\n * <pre>\\n * var scrollOffset = goog.style.bidi.getOffsetStart(element);\\n * goog.style.bidi.setScrollOffset(element.offsetParent, scrollOffset);\\n * </pre>\\n *\\n * @see setScrollOffset\\n *\\n * @param {Element} element The element for which we need to determine the\\n *     offsetStart position.\\n * @return {number} The offsetStart for that element.\\n */\\ngoog.style.bidi.getOffsetStart = function(element) {\\n  element = /** @type {!HTMLElement} */ (element);\\n  var offsetLeftForReal = element.offsetLeft;\\n\\n  // The element might not have an offsetParent.\\n  // For example, the node might not be attached to the DOM tree,\\n  // and position:fixed children do not have an offset parent.\\n  // Just try to do the best we can with what we have.\\n  var bestParent = element.offsetParent;\\n\\n  if (!bestParent && goog.style.getComputedPosition(element) == 'fixed') {\\n    bestParent = goog.dom.getOwnerDocument(element).documentElement;\\n  }\\n\\n  // Just give up in this case.\\n  if (!bestParent) {\\n    return offsetLeftForReal;\\n  }\\n\\n  if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(58)) {\\n    // When calculating an element's offsetLeft, Firefox 57 and below\\n    // erroneously subtracts the border width from the actual distance.\\n    // So we need to add it back. (Fixed in FireFox 58+)\\n    var borderWidths = goog.style.getBorderBox(bestParent);\\n    offsetLeftForReal += borderWidths.left;\\n  } else if (\\n      goog.userAgent.isDocumentModeOrHigher(8) &&\\n      !goog.userAgent.isDocumentModeOrHigher(9)) {\\n    // When calculating an element's offsetLeft, IE8/9-Standards Mode\\n    // erroneously adds the border width to the actual distance.  So we need to\\n    // subtract it.\\n    var borderWidths = goog.style.getBorderBox(bestParent);\\n    offsetLeftForReal -= borderWidths.left;\\n  }\\n\\n  if (goog.style.isRightToLeft(bestParent)) {\\n    // Right edge of the element relative to the left edge of its parent.\\n    var elementRightOffset = offsetLeftForReal + element.offsetWidth;\\n\\n    // Distance from the parent's right edge to the element's right edge.\\n    return bestParent.clientWidth - elementRightOffset;\\n  }\\n\\n  return offsetLeftForReal;\\n};\\n\\n\\n/**\\n * Sets the element's scrollLeft attribute so it is correctly scrolled by\\n * offsetStart pixels.  This takes into account whether the element is RTL and\\n * the nuances of different browsers.  To scroll to the \\\"beginning\\\" of an\\n * element use getOffsetStart to obtain the element's offsetStart value and then\\n * pass the value to setScrollOffset.\\n * @see getOffsetStart\\n * @param {Element} element The element to set scrollLeft on.\\n * @param {number} offsetStart The number of pixels to scroll the element.\\n *     If this value is < 0, 0 is used.\\n */\\ngoog.style.bidi.setScrollOffset = function(element, offsetStart) {\\n  offsetStart = Math.max(offsetStart, 0);\\n  // In LTR and in \\\"mirrored\\\" browser RTL (such as IE), we set scrollLeft to\\n  // the number of pixels to scroll.\\n  // Otherwise, in RTL, we need to account for different browser behavior.\\n  if (!goog.style.isRightToLeft(element)) {\\n    element.scrollLeft = offsetStart;\\n  } else if (goog.style.bidi.usesNegativeScrollLeftInRtl_()) {\\n    element.scrollLeft = -offsetStart;\\n  } else if (\\n      !(goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher('8'))) {\\n    // Take the current scrollLeft value and move to the right by the\\n    // offsetStart to get to the left edge of the element, and then by\\n    // the clientWidth of the element to get to the right edge.\\n    element.scrollLeft =\\n        element.scrollWidth - offsetStart - element.clientWidth;\\n  } else {\\n    element.scrollLeft = offsetStart;\\n  }\\n};\\n\\n\\n/**\\n * @return {boolean} Whether the current browser returns negative scrollLeft\\n *     values for RTL elements. If true, then scrollLeft starts at 0 and then\\n *     becomes more negative as the element is scrolled towards the left.\\n * @private\\n */\\ngoog.style.bidi.usesNegativeScrollLeftInRtl_ = function() {\\n  var isSafari10Plus =\\n      goog.userAgent.product.SAFARI && goog.userAgent.product.isVersion(10);\\n  var isIOS10Plus = goog.userAgent.IOS && goog.userAgent.platform.isVersion(10);\\n  return goog.userAgent.GECKO || isSafari10Plus || isIOS10Plus;\\n};\\n\\n\\n/**\\n * Sets the element's left style attribute in LTR or right style attribute in\\n * RTL.  Also clears the left attribute in RTL and the right attribute in LTR.\\n * @param {Element} elem The element to position.\\n * @param {number} left The left position in LTR; will be set as right in RTL.\\n * @param {?number} top The top position.  If null only the left/right is set.\\n * @param {boolean} isRtl Whether we are in RTL mode.\\n */\\ngoog.style.bidi.setPosition = function(elem, left, top, isRtl) {\\n  if (top !== null) {\\n    elem.style.top = top + 'px';\\n  }\\n  if (isRtl) {\\n    elem.style.right = left + 'px';\\n    elem.style.left = '';\\n  } else {\\n    elem.style.left = left + 'px';\\n    elem.style.right = '';\\n  }\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"style\",\"bidi\",\"getScrollLeft\",\"goog.style.bidi.getScrollLeft\",\"element\",\"isRtl\",\"isRightToLeft\",\"usesNegativeScrollLeftInRtl_\",\"scrollLeft\",\"userAgent\",\"EDGE_OR_IE\",\"isVersionOrHigher\",\"overflowX\",\"getComputedOverflowX\",\"scrollWidth\",\"clientWidth\",\"getOffsetStart\",\"goog.style.bidi.getOffsetStart\",\"offsetLeftForReal\",\"offsetLeft\",\"bestParent\",\"offsetParent\",\"getComputedPosition\",\"dom\",\"getOwnerDocument\",\"documentElement\",\"GECKO\",\"borderWidths\",\"getBorderBox\",\"left\",\"isDocumentModeOrHigher\",\"elementRightOffset\",\"offsetWidth\",\"setScrollOffset\",\"goog.style.bidi.setScrollOffset\",\"offsetStart\",\"Math\",\"max\",\"goog.style.bidi.usesNegativeScrollLeftInRtl_\",\"isSafari10Plus\",\"product\",\"SAFARI\",\"isVersion\",\"isIOS10Plus\",\"IOS\",\"platform\",\"setPosition\",\"goog.style.bidi.setPosition\",\"elem\",\"top\",\"right\"]\n}\n"]