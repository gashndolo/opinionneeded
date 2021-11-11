(ns opinionneeded.routes.services
  (:require
   [reitit.swagger :as swagger]
   [reitit.swagger-ui :as swagger-ui]
   [reitit.ring.coercion :as coercion]
   [reitit.coercion.spec :as spec-coercion]
   [reitit.ring.middleware.muuntaja :as muuntaja]
   [reitit.ring.middleware.exception :as exception]
   [reitit.ring.middleware.multipart :as multipart]
   [reitit.ring.middleware.parameters :as parameters]
   [spec-tools.data-spec :as ds]
   
   ;[opinionneeded.auth :as auth]
   ;
   ;[guestbook.auth.ring :refer [wrap-authorized get-roles-from-match]]
   [clojure.tools.logging :as log]
   [opinionneeded.auth :as auth]
   ;
   ;; require these namespaces
   [clojure.java.io :as io]
   [opinionneeded.db.core :as db]
   ;; ...
   ;
   ;
   ;;require these namespaces
   ;[opinionneeded.media :as media]
   [clojure.spec.alpha :as s]
   [clojure.string :as string]
   ;; ...
   ;
   [opinionneeded.topics :as tpc]
   ;[guestbook.author :as author]
   [ring.util.http-response :as response]
   [opinionneeded.middleware.formats :as formats]))


(defn service-routes []
  ["/api"
   {:middleware [;; query-params & form-params
                 parameters/parameters-middleware
                 ;; content-negotiation
                 muuntaja/format-negotiate-middleware
                 ;; encoding response body
                 muuntaja/format-response-middleware
                 ;; exception handling
                 exception/exception-middleware
                 ;; decoding request body
                 muuntaja/format-request-middleware
                 ;; coercing response bodys
                 coercion/coerce-response-middleware
                 ;; coercing request parameters
                 coercion/coerce-request-middleware
                 ;; multipart params
                 multipart/multipart-middleware]
    :muuntaja formats/instance
    :coercion spec-coercion/coercion
    :swagger {:id ::api}}
   ["" {:no-doc true}
    ["/swagger.json"
     {:get (swagger/create-swagger-handler)}]
    ["/swagger-ui*"
     {:get (swagger-ui/create-swagger-ui-handler
            {:url "/api/swagger.json"})}]]
   ["/all"
    {:get
     {:responses
      {200
       {:body
        {:topics
         [{:id pos-int?
           :title string?}]
         :arguments
         [{:id pos-int?
           :comment string?}]
         :comments
         [{:id pos-int?
           :comment string?}]}}}
      :handler
      (fn [{{:keys [identity]} :session}]
        (response/ok (tpc/get-all-by-author identity)))}}]
   ["/topics"
    {:get
     {:responses
      {200
       {:body
        {:topics
         [{:id pos-int?
           :title string?
           :description string?
           :upvotes int?
           :timestamp inst?}]}}}
      :handler
      (fn [_]
        (response/ok (tpc/topic-list)))}}]
   ["/topic"
    ["/:topic-id"
     {:get
      {:parameters
       {:path
        {:topic-id pos-int?}}
       :responses
       {200 {:topic map?
             :arguments
             [{:id pos-int?
               :comment string?
               :upvotes int?
               :topic_id pos-int?}]
             :comments
             [{:id pos-int?
               :comment string?
               :upvotes int?
               :argument_id pos-int?
               :topic_id pos-int?}]}
        403 {:message string?}
        404 {:message string?}
        500 {:message string?}}
       :handler
       (fn [{{{:keys [topic-id]} :path} :parameters}]
         (if-some [post (tpc/single-topic topic-id)]
           (response/ok post)
           (response/not-found
            {:message "Post Not Found"})))}}]]
   ["/argument"
    {:post
     {:parameters
      {:body
       {:topic_id pos-int?
        :comment string?
        :affirm boolean?}}
      :response
      {200
       {:body map?}
       400
       {:body map?}
       500
       {:errors map?}}
      :handler
      (fn [{{params :body} :parameters
            {:keys [identity]} :session}]
        (try
          (->> (tpc/save-argument! identity params)
               (assoc {:status :ok} :argument)
               (response/ok))
          (catch Exception e
            (let [{id :opinionneeded/error-id
                   errors :errors} (ex-data e)]
              (case id
                :validation
                (response/bad-request {:errors errors})
                ;;else
                (response/internal-server-error
                 {:errors
                  {:server-error ["Failed to save message!"]}}))))))}}]
   ["/comment"
    {:post
     {:parameters
      {:body
       {:topic_id pos-int?
        :comment string?
        :argument_id pos-int?}}
      :response
      {200
       {:body map?}
       400
       {:body map?}
       500
       {:errors map?}}
      :handler
      (fn [{{params :body} :parameters
            {:keys [identity]} :session}]
        (try
          (->> (tpc/save-comment! identity params)
               (assoc {:status :ok} :comment)
               (response/ok))
          (catch Exception e
            (let [{id :opinionneeded/error-id
                   errors :errors} (ex-data e)]
              (case id
                :validation
                (response/bad-request {:errors errors})
                ;;else
                (response/internal-server-error
                 {:errors
                  {:server-error ["Failed to save message!"]}}))))))}}]
   ["/debate"
    {:post
     {:parameters
      {:body
       {:title string?
        :description string?}}
      :response
      {200
       {:body map?}
       400
       {:body map?}
       500
       {:errors map?}}
      :handler
      (fn [{{params :body} :parameters
            {:keys [identity]} :session}]
        (try
          (->> (tpc/save-debate! identity params)
               (assoc {:status :ok} :topic)
               (response/ok))
          (catch Exception e
            (let [{id :opinionneeded/error-id
                   errors :errors} (ex-data e)]
              (case id
                :validation
                (response/bad-request {:errors errors})
                ;;else
                (response/internal-server-error
                 {:errors
                  {:server-error ["Failed to save message!"]}}))))))}}]
   ["/login"
    {:post {:parameters
            {:body
             {:login string?
              :password string?}}
            :responses
            {200
             {:body
              {:identity
               {:login string?
                :created_at inst?}}}
             401
             {:body
              {:message string?}}}
            :handler
            (fn [{{{:keys [login password]} :body} :parameters
                  session :session}]
              (if-some [user (auth/authenticate-user login password)]
                (->
                 (response/ok
                  {:identity user})
                 (assoc :session (assoc session
                                        :identity
                                        user)))
                (response/unauthorized
                 {:message "Incorrect login or password."})))}}]
   ["/register"
    {:post {:parameters
            {:body
             {:login string?
              :password string?
              :confirm string?}}
            :responses
            {200
             {:body
              {:message string?}}
             400
             {:body
              {:message string?}}
             409
             {:body
              {:message string?}}}
            :handler
            (fn [{{{:keys [login password confirm]} :body} :parameters}]
              (if-not (= password confirm)
                (response/bad-request
                 {:message
                  "Password and Confirm do not match."})
                (try
                  (auth/create-user! login password)
                  (response/ok
                   {:message
                    "User registration successful. Please log in."})
                  (catch clojure.lang.ExceptionInfo e
                    (if (= (:opinionneeded/error-id (ex-data e))
                           ::auth/duplicate-user)
                      (response/conflict
                       {:message
                        "Registration failed! User with login already exists!"})
                      (throw e))))))}}]
   ["/logout"
    {:post {:handler
            (fn [_]
              (->
               (response/ok)
               (assoc :session nil)))}}]
   ["/session"
    {:get
     {:responses
      {200
       {:body
        {:session
         {:identity
          (ds/maybe
           {:login string?
            :created_at inst?})}}}}
      :handler
      (fn [{{:keys [identity]} :session}]
        (response/ok {:session
                      {:identity
                       (not-empty
                        (select-keys identity [:login :created_at]))}}))}}]
   ["/delete"
    ["argument/:arg-id"
     {:post
      {:parameters
       {:path
        {:arg-id pos-int?}}
       :responses
       {200
        {:body map?}
        404
        {:message string?}}
       :handler
       (fn [{{{:keys [arg-id]} :path} :parameters}]
         (try (->> (tpc/delete-argument arg-id)
                   (response/ok))
              (catch Exception e
                (response/bad-request {:message "Post not deleted"}))))}}]
    ["comment/:arg-id"
     {:post
      {:parameters
       {:path
        {:arg-id pos-int?}}
       :responses
       {200
        {:body map?}
        404
        {:message string?}}
       :handler
       (fn [{{{:keys [arg-id]} :path} :parameters}]
         (try (->> (tpc/delete-comment arg-id)
                   (response/ok))
              (catch Exception e
                (response/bad-request {:message "Post not deleted"}))))}}]
    ["topic/:arg-id"
     {:post
      {:parameters
       {:path
        {:arg-id pos-int?}}
       :responses
       {200
        {:body map?}
        404
        {:message string?}}
       :handler
       (fn [{{{:keys [arg-id]} :path} :parameters}]
         (try (->> (tpc/delete-topic arg-id)
                   (response/ok))
              (catch Exception e
                (response/bad-request {:message "Post not deleted"}))))}}]]])