(ns opinionneeded.env
  (:require [clojure.tools.logging :as log]))

(def defaults
  {:init
   (fn []
     (log/info "\n-=[opinionneeded started successfully]=-"))
   :stop
   (fn []
     (log/info "\n-=[opinionneeded has shut down successfully]=-"))
   :middleware identity})
