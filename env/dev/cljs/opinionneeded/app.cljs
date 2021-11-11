(ns ^:dev/once opinionneeded.app
  (:require
   [devtools.core :as devtools]
   [opinionneeded.core :as core]))

(enable-console-print!)

(println "loading env/dev/cljs/opinionneeded/app.cljs...")

(devtools/install!)

(core/init!)