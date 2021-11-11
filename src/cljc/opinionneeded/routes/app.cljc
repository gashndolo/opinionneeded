(ns opinionneeded.routes.app
  (:require
   #?@(:clj [[opinionneeded.layout :as layout]
             [opinionneeded.middleware :as middleware]]
       :cljs [[opinionneeded.views.home :as home]
              [opinionneeded.views.topic :as topic]
              [opinionneeded.views.argument :as argument]
              ;[opinionneeded.views.my-account :as my-account]
              ])))

#?(:clj
   (defn home-page [request]
     (layout/render
      request
      "home.html")))

(defn app-routes []
  [""
   #?(:clj {:middleware [middleware/wrap-csrf]
            :get home-page})
   ["/"
    (merge
     {:name ::home}
     #?(:cljs
        {:view #'home/home}))]
   ["/topic/:topic"
    (merge
     {:name ::topic}
     #?(:cljs
        {:view #'topic/topic}))]
   ["/argument/:argument"
    (merge
     {:name ::argument}
     #?(:cljs
        {:view #'argument/argument}))]
   ;; ["my-account"
   ;;  (merge
   ;;   {:name ::account}
   ;;   #?(:cljs
   ;;      {:view #'my-account/my-account}))]
   ])