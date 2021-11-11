["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/fx/transitionbase.js"],"~:js","goog.provide(\"goog.fx.TransitionBase\");\ngoog.provide(\"goog.fx.TransitionBase.State\");\ngoog.require(\"goog.events.EventTarget\");\ngoog.require(\"goog.fx.Transition\");\ngoog.fx.TransitionBase = function() {\n  goog.fx.TransitionBase.base(this, \"constructor\");\n  this.state_ = goog.fx.TransitionBase.State.STOPPED;\n  this.startTime = null;\n  this.endTime = null;\n};\ngoog.inherits(goog.fx.TransitionBase, goog.events.EventTarget);\ngoog.fx.TransitionBase.State = {STOPPED:0, PAUSED:-1, PLAYING:1};\ngoog.fx.TransitionBase.prototype.play = goog.abstractMethod;\ngoog.fx.TransitionBase.prototype.stop = goog.abstractMethod;\ngoog.fx.TransitionBase.prototype.pause = goog.abstractMethod;\ngoog.fx.TransitionBase.prototype.getStateInternal = function() {\n  return this.state_;\n};\ngoog.fx.TransitionBase.prototype.setStatePlaying = function() {\n  this.state_ = goog.fx.TransitionBase.State.PLAYING;\n};\ngoog.fx.TransitionBase.prototype.setStatePaused = function() {\n  this.state_ = goog.fx.TransitionBase.State.PAUSED;\n};\ngoog.fx.TransitionBase.prototype.setStateStopped = function() {\n  this.state_ = goog.fx.TransitionBase.State.STOPPED;\n};\ngoog.fx.TransitionBase.prototype.isPlaying = function() {\n  return this.state_ == goog.fx.TransitionBase.State.PLAYING;\n};\ngoog.fx.TransitionBase.prototype.isPaused = function() {\n  return this.state_ == goog.fx.TransitionBase.State.PAUSED;\n};\ngoog.fx.TransitionBase.prototype.isStopped = function() {\n  return this.state_ == goog.fx.TransitionBase.State.STOPPED;\n};\ngoog.fx.TransitionBase.prototype.onBegin = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.BEGIN);\n};\ngoog.fx.TransitionBase.prototype.onEnd = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.END);\n};\ngoog.fx.TransitionBase.prototype.onFinish = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.FINISH);\n};\ngoog.fx.TransitionBase.prototype.onPause = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PAUSE);\n};\ngoog.fx.TransitionBase.prototype.onPlay = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PLAY);\n};\ngoog.fx.TransitionBase.prototype.onResume = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.RESUME);\n};\ngoog.fx.TransitionBase.prototype.onStop = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.STOP);\n};\ngoog.fx.TransitionBase.prototype.dispatchAnimationEvent = function(type) {\n  this.dispatchEvent(type);\n};\n","~:source","// Copyright 2011 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview An abstract base class for transitions. This is a simple\n * interface that allows for playing, pausing and stopping an animation. It adds\n * a simple event model, and animation status.\n */\ngoog.provide('goog.fx.TransitionBase');\ngoog.provide('goog.fx.TransitionBase.State');\n\ngoog.require('goog.events.EventTarget');\ngoog.require('goog.fx.Transition');  // Unreferenced: interface\n\n\n\n/**\n * Constructor for a transition object.\n *\n * @constructor\n * @struct\n * @implements {goog.fx.Transition}\n * @extends {goog.events.EventTarget}\n */\ngoog.fx.TransitionBase = function() {\n  goog.fx.TransitionBase.base(this, 'constructor');\n\n  /**\n   * The internal state of the animation.\n   * @type {goog.fx.TransitionBase.State}\n   * @private\n   */\n  this.state_ = goog.fx.TransitionBase.State.STOPPED;\n\n  /**\n   * Timestamp for when the animation was started.\n   * @type {?number}\n   * @protected\n   */\n  this.startTime = null;\n\n  /**\n   * Timestamp for when the animation finished or was stopped.\n   * @type {?number}\n   * @protected\n   */\n  this.endTime = null;\n};\ngoog.inherits(goog.fx.TransitionBase, goog.events.EventTarget);\n\n\n/**\n * Enum for the possible states of an animation.\n * @enum {number}\n */\ngoog.fx.TransitionBase.State = {\n  STOPPED: 0,\n  PAUSED: -1,\n  PLAYING: 1\n};\n\n\n/**\n * Plays the animation.\n *\n * @param {boolean=} opt_restart Optional parameter to restart the animation.\n * @return {boolean} True iff the animation was started.\n * @override\n */\ngoog.fx.TransitionBase.prototype.play = goog.abstractMethod;\n\n\n/**\n * Stops the animation.\n *\n * @param {boolean=} opt_gotoEnd Optional boolean parameter to go the the end of\n *     the animation.\n * @override\n */\ngoog.fx.TransitionBase.prototype.stop = goog.abstractMethod;\n\n\n/**\n * Pauses the animation.\n */\ngoog.fx.TransitionBase.prototype.pause = goog.abstractMethod;\n\n\n/**\n * Returns the current state of the animation.\n * @return {goog.fx.TransitionBase.State} State of the animation.\n */\ngoog.fx.TransitionBase.prototype.getStateInternal = function() {\n  return this.state_;\n};\n\n\n/**\n * Sets the current state of the animation to playing.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.setStatePlaying = function() {\n  this.state_ = goog.fx.TransitionBase.State.PLAYING;\n};\n\n\n/**\n * Sets the current state of the animation to paused.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.setStatePaused = function() {\n  this.state_ = goog.fx.TransitionBase.State.PAUSED;\n};\n\n\n/**\n * Sets the current state of the animation to stopped.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.setStateStopped = function() {\n  this.state_ = goog.fx.TransitionBase.State.STOPPED;\n};\n\n\n/**\n * @return {boolean} True iff the current state of the animation is playing.\n */\ngoog.fx.TransitionBase.prototype.isPlaying = function() {\n  return this.state_ == goog.fx.TransitionBase.State.PLAYING;\n};\n\n\n/**\n * @return {boolean} True iff the current state of the animation is paused.\n */\ngoog.fx.TransitionBase.prototype.isPaused = function() {\n  return this.state_ == goog.fx.TransitionBase.State.PAUSED;\n};\n\n\n/**\n * @return {boolean} True iff the current state of the animation is stopped.\n */\ngoog.fx.TransitionBase.prototype.isStopped = function() {\n  return this.state_ == goog.fx.TransitionBase.State.STOPPED;\n};\n\n\n/**\n * Dispatches the BEGIN event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onBegin = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.BEGIN);\n};\n\n\n/**\n * Dispatches the END event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onEnd = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.END);\n};\n\n\n/**\n * Dispatches the FINISH event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onFinish = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.FINISH);\n};\n\n\n/**\n * Dispatches the PAUSE event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onPause = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PAUSE);\n};\n\n\n/**\n * Dispatches the PLAY event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onPlay = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PLAY);\n};\n\n\n/**\n * Dispatches the RESUME event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onResume = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.RESUME);\n};\n\n\n/**\n * Dispatches the STOP event. Sub classes should override this instead\n * of listening to the event, and call this instead of dispatching the event.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.onStop = function() {\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.STOP);\n};\n\n\n/**\n * Dispatches an event object for the current animation.\n * @param {string} type Event type that will be dispatched.\n * @protected\n */\ngoog.fx.TransitionBase.prototype.dispatchAnimationEvent = function(type) {\n  this.dispatchEvent(type);\n};\n","~:compiled-at",1636626309678,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.fx.transitionbase.js\",\n\"lineCount\":61,\n\"mappings\":\"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\",\n\"sources\":[\"goog/fx/transitionbase.js\"],\n\"sourcesContent\":[\"// Copyright 2011 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview An abstract base class for transitions. This is a simple\\n * interface that allows for playing, pausing and stopping an animation. It adds\\n * a simple event model, and animation status.\\n */\\ngoog.provide('goog.fx.TransitionBase');\\ngoog.provide('goog.fx.TransitionBase.State');\\n\\ngoog.require('goog.events.EventTarget');\\ngoog.require('goog.fx.Transition');  // Unreferenced: interface\\n\\n\\n\\n/**\\n * Constructor for a transition object.\\n *\\n * @constructor\\n * @struct\\n * @implements {goog.fx.Transition}\\n * @extends {goog.events.EventTarget}\\n */\\ngoog.fx.TransitionBase = function() {\\n  goog.fx.TransitionBase.base(this, 'constructor');\\n\\n  /**\\n   * The internal state of the animation.\\n   * @type {goog.fx.TransitionBase.State}\\n   * @private\\n   */\\n  this.state_ = goog.fx.TransitionBase.State.STOPPED;\\n\\n  /**\\n   * Timestamp for when the animation was started.\\n   * @type {?number}\\n   * @protected\\n   */\\n  this.startTime = null;\\n\\n  /**\\n   * Timestamp for when the animation finished or was stopped.\\n   * @type {?number}\\n   * @protected\\n   */\\n  this.endTime = null;\\n};\\ngoog.inherits(goog.fx.TransitionBase, goog.events.EventTarget);\\n\\n\\n/**\\n * Enum for the possible states of an animation.\\n * @enum {number}\\n */\\ngoog.fx.TransitionBase.State = {\\n  STOPPED: 0,\\n  PAUSED: -1,\\n  PLAYING: 1\\n};\\n\\n\\n/**\\n * Plays the animation.\\n *\\n * @param {boolean=} opt_restart Optional parameter to restart the animation.\\n * @return {boolean} True iff the animation was started.\\n * @override\\n */\\ngoog.fx.TransitionBase.prototype.play = goog.abstractMethod;\\n\\n\\n/**\\n * Stops the animation.\\n *\\n * @param {boolean=} opt_gotoEnd Optional boolean parameter to go the the end of\\n *     the animation.\\n * @override\\n */\\ngoog.fx.TransitionBase.prototype.stop = goog.abstractMethod;\\n\\n\\n/**\\n * Pauses the animation.\\n */\\ngoog.fx.TransitionBase.prototype.pause = goog.abstractMethod;\\n\\n\\n/**\\n * Returns the current state of the animation.\\n * @return {goog.fx.TransitionBase.State} State of the animation.\\n */\\ngoog.fx.TransitionBase.prototype.getStateInternal = function() {\\n  return this.state_;\\n};\\n\\n\\n/**\\n * Sets the current state of the animation to playing.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.setStatePlaying = function() {\\n  this.state_ = goog.fx.TransitionBase.State.PLAYING;\\n};\\n\\n\\n/**\\n * Sets the current state of the animation to paused.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.setStatePaused = function() {\\n  this.state_ = goog.fx.TransitionBase.State.PAUSED;\\n};\\n\\n\\n/**\\n * Sets the current state of the animation to stopped.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.setStateStopped = function() {\\n  this.state_ = goog.fx.TransitionBase.State.STOPPED;\\n};\\n\\n\\n/**\\n * @return {boolean} True iff the current state of the animation is playing.\\n */\\ngoog.fx.TransitionBase.prototype.isPlaying = function() {\\n  return this.state_ == goog.fx.TransitionBase.State.PLAYING;\\n};\\n\\n\\n/**\\n * @return {boolean} True iff the current state of the animation is paused.\\n */\\ngoog.fx.TransitionBase.prototype.isPaused = function() {\\n  return this.state_ == goog.fx.TransitionBase.State.PAUSED;\\n};\\n\\n\\n/**\\n * @return {boolean} True iff the current state of the animation is stopped.\\n */\\ngoog.fx.TransitionBase.prototype.isStopped = function() {\\n  return this.state_ == goog.fx.TransitionBase.State.STOPPED;\\n};\\n\\n\\n/**\\n * Dispatches the BEGIN event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onBegin = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.BEGIN);\\n};\\n\\n\\n/**\\n * Dispatches the END event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onEnd = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.END);\\n};\\n\\n\\n/**\\n * Dispatches the FINISH event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onFinish = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.FINISH);\\n};\\n\\n\\n/**\\n * Dispatches the PAUSE event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onPause = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PAUSE);\\n};\\n\\n\\n/**\\n * Dispatches the PLAY event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onPlay = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PLAY);\\n};\\n\\n\\n/**\\n * Dispatches the RESUME event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onResume = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.RESUME);\\n};\\n\\n\\n/**\\n * Dispatches the STOP event. Sub classes should override this instead\\n * of listening to the event, and call this instead of dispatching the event.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.onStop = function() {\\n  this.dispatchAnimationEvent(goog.fx.Transition.EventType.STOP);\\n};\\n\\n\\n/**\\n * Dispatches an event object for the current animation.\\n * @param {string} type Event type that will be dispatched.\\n * @protected\\n */\\ngoog.fx.TransitionBase.prototype.dispatchAnimationEvent = function(type) {\\n  this.dispatchEvent(type);\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"fx\",\"TransitionBase\",\"goog.fx.TransitionBase\",\"base\",\"state_\",\"State\",\"STOPPED\",\"startTime\",\"endTime\",\"inherits\",\"events\",\"EventTarget\",\"PAUSED\",\"PLAYING\",\"prototype\",\"play\",\"abstractMethod\",\"stop\",\"pause\",\"getStateInternal\",\"goog.fx.TransitionBase.prototype.getStateInternal\",\"setStatePlaying\",\"goog.fx.TransitionBase.prototype.setStatePlaying\",\"setStatePaused\",\"goog.fx.TransitionBase.prototype.setStatePaused\",\"setStateStopped\",\"goog.fx.TransitionBase.prototype.setStateStopped\",\"isPlaying\",\"goog.fx.TransitionBase.prototype.isPlaying\",\"isPaused\",\"goog.fx.TransitionBase.prototype.isPaused\",\"isStopped\",\"goog.fx.TransitionBase.prototype.isStopped\",\"onBegin\",\"goog.fx.TransitionBase.prototype.onBegin\",\"dispatchAnimationEvent\",\"Transition\",\"EventType\",\"BEGIN\",\"onEnd\",\"goog.fx.TransitionBase.prototype.onEnd\",\"END\",\"onFinish\",\"goog.fx.TransitionBase.prototype.onFinish\",\"FINISH\",\"onPause\",\"goog.fx.TransitionBase.prototype.onPause\",\"PAUSE\",\"onPlay\",\"goog.fx.TransitionBase.prototype.onPlay\",\"PLAY\",\"onResume\",\"goog.fx.TransitionBase.prototype.onResume\",\"RESUME\",\"onStop\",\"goog.fx.TransitionBase.prototype.onStop\",\"STOP\",\"goog.fx.TransitionBase.prototype.dispatchAnimationEvent\",\"type\",\"dispatchEvent\"]\n}\n"]