(ns opinionneeded.core
  (:require [reagent.dom :as dom]
            [reagent.core :as r]
            [reitit.coercion.spec :as reitit-spec]
            [reitit.frontend :as rtf]
            [reitit.frontend.easy :as rtfe]
            [clojure.string :as string]
            [re-frame.core :as rf]
            [opinionneeded.auth :as auth]
            [opinionneeded.modals :as m]
            [opinionneeded.routes.app :refer [app-routes]]
            [ajax.core :refer [GET POST]]))


(rf/reg-fx
 :ajax/get
 (fn [{:keys [url success-event error-event success-path]}]
   (GET url
     (cond-> {:headers {"Accept" "application/transit+json"}}
       success-event (assoc :handler
                            #(rf/dispatch
                              (conj success-event
                                    (if success-path
                                      (get-in % success-path)
                                      %))))
       error-event (assoc :error-handler
                          #(rf/dispatch
                            (conj error-event %)))))))

(rf/reg-event-fx
 :app/initialize
 (fn [_ _]
   {:db {:topics/loading? true
         :session/loading? true
         :topic/loading? true}
    :dispatch-n [[:session/load] [:topics/load]]}))








(rf/reg-event-fx
 :topics/load
 (fn [{:keys [db]} _]
   (GET "/api/topics"
     {:headers {"Accept" "application/transit+json"}
      :handler (fn [r]
                 (rf/dispatch [:topics/set (:topics r)]))})
   {:db (assoc db :topics/loading? true)}))

(rf/reg-event-fx
 :delete/argument
 (fn [_ [_ id]]
   (POST (str "api/deleteargument/" id)
     {:headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :handler #(rf/dispatch [:postsload])
      :error-handler (.log js/console "Argument not deleted")})))

(rf/reg-event-fx
 :delete/topic
 (fn [_ [_ id]]
   (POST (str "api/deletetopic/" id)
     {:headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :handler #(rf/dispatch [:postsload])
      :error-handler (.log js/console "Argument not deleted")})))

(rf/reg-event-fx
 :delete/comment
 (fn [_ [_ id]]
   (POST (str "api/deletecomment/" id)
     {:headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :handler #(rf/dispatch [:postsload])
      :error-handler (.log js/console "Argument not deleted")})))
(rf/reg-event-db
 :topics/set
 (fn [db [_ topics]]
   (assoc db
          :topics/loading? false
          :topics/list topics)))

(rf/reg-sub
 :topics/list
 (fn [db _]
   (:topics/list db [])))

(rf/reg-event-db
 :router/navigated
 (fn [db [_ new-match]]
   (assoc db :router/current-route new-match)))

(rf/reg-sub
 :router/current-route
 (fn [db]
   (:router/current-route db)))

(rf/reg-event-fx
 :postsload
 (fn [{:keys [db]} _]
   (GET "/api/all"
     {:headers {"Accept" "application/transit+json"}
      :handler (fn [r]
                 (rf/dispatch [:setposts r]))
      :error-handler (fn [e]
                       (.log js/console (str "some error" e)))})
   {:db (assoc db :myposts-loading true)}))


(rf/reg-event-db
 :setposts
 (fn [db [_ r]]
   (assoc db
          :posts r
          :myposts-loading false)))

(rf/reg-sub
 :myposts
 (fn [db _]
   (:posts db)))

(rf/reg-event-db
 :set/topic
 (fn [db [_ id title description upvotes timestamp]]
   (assoc db
          :topic
          {:id id :title title :description description :upvotes upvotes :timestamp timestamp})))


(defn my-account []
  (let [my-posts (rf/subscribe [:myposts])]
    (fn []
      [:div
       [:ul.posts
        (for [{:keys [id title]} (:topics @my-posts)]
          [:li
           [:p title [:button.button
                      {:on-click #(rf/dispatch [:delete/topic id])}
                      "delete"]]])]
       [:ul.posts
        (for [{:keys [id comment]} (:comments @my-posts)]
          [:li
           [:p comment [:button.button
                        {:on-click #(rf/dispatch [:delete/comment id])}
                        "delete"]]])]
       [:ul.posts
        (for [{:keys [id comment]} (:arguments @my-posts)]
          [:li
           [:p comment [:button.button
                        {:on-click #(rf/dispatch [:delete/argument id])}
                        "delete"]]])]])))


(rf/reg-event-db
 :argument/id
 (fn [db [_ id]]
   (assoc db
          :argument/id id)))

(rf/reg-sub
 :argument/id?
 (fn [db]
   (:argument/id db)))

(rf/reg-event-db
 :debate/id
 (fn [db [_ id]]
   (GET (str "/api/topic/" id)
     {:headers {"Accept" "application/transit+json"}
      :handler (fn [r]
                 (rf/dispatch [:debate/set r])
                 (.log js/console (str r)))

      :error-handler (fn [e]
                       (.log js/console (str e)))})
   (assoc db :debate/id id)))

(rf/reg-sub
 :debate/id?
 (fn [db _]
   (:debate/id db)))

(rf/reg-event-db
 :debate/set
 (fn [db [_ r]]
   (assoc db
          :topic (get r :topic)
          :affirmatives (vec (filter #(= (% :affirm) true) (get r :arguments)))
          :negatives (vec (filter #(= (% :affirm) false) (get r :arguments)))
          :comments (vec (get r :comments))
          :topic/loading? false)))

(rf/reg-sub
 :debate/topic
 (fn [db _]
   (:topic db)))

(rf/reg-sub
 :debate/affirmatives
 (fn [db _]
   (:affirmatives db)))

(rf/reg-sub
 :debate/negatives
 (fn [db _]
   (:negatives db)))

(rf/reg-sub
 :debate/comments
 (fn [db _]
   (:comments db)))

(rf/reg-event-db
 :comment/add
 (fn [db [_ comment]]
   (update db :comments conj comment)))

(rf/reg-event-db
 :topic/add
 (fn [db [_ topic]]
   (update db :topics/list conj topic)))

(rf/reg-event-db
 :affirmative/add
 (fn [db [_ argument]]
   (update db :affirmatives conj argument)))

(rf/reg-event-db
 :negative/add
 (fn [db [_ argument]]
   (update db :negatives conj argument)))


(rf/reg-event-db
 :form/set-field
 [(rf/path :form/fields)]
 (fn [fields [_ id value position]]
   (if (= position "Agree")
     (assoc fields
            :topic_id id
            :comment value
            :affirm true)
     (assoc fields
            :topic_id id
            :comment value
            :affirm false))))

(rf/reg-event-db
 :form/set-field-position
 [(rf/path :form/fields)]
 (fn [fields [_ value]]
   (if (= value "Agree")
     (assoc fields :affirm true)
     (assoc fields :affirm false))))

(rf/reg-event-db
 :form/clear-field-position
 [(rf/path :form/fields)]
 (fn [fields _]
   (assoc fields :affirm true)))

(rf/reg-event-db
 :form/clear-fields
 [(rf/path :form/fields)]
 (fn [_ _]
   {}))

(rf/reg-sub
 :form/fields
 (fn [db _]
   (:form/fields db)))

(rf/reg-sub
 :form/field
 :<- [:form/fields]
 (fn [fields [_ id]]
   (get fields id)))

(rf/reg-event-fx
 :argument/send!
 (fn [{:keys [db]} [_ fields]]
   (POST "/api/argument"
     {:format :json
      :headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :params fields
      :handler #(do
                  (rf/dispatch [:form/clear-fields])
                  (if (:affirm (:argument %))
                    (rf/dispatch [:affirmative/add (:argument %)])
                    (rf/dispatch [:negative/add (:argument %)])))
      :error-handler #(.log js/console "Argument not posted")})))

(rf/reg-event-db
 :form/set-field-comment
 [(rf/path :form/fields)]
 (fn [fields [_ id arg-id value]]
   (assoc fields :topic_id id :argument_id arg-id :comment value)))

(rf/reg-event-db
 :form/set-field-debate
 [(rf/path :form/fields)]
 (fn [fields [_ id value]]
   (assoc fields id value)))

(rf/reg-event-fx
 :comment/send!
 (fn [{:keys [db]} [_ fields]]
   (POST "/api/comment"
     {:format :json
      :headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :params fields
      :handler #(do
                  (rf/dispatch [:form/clear-fields])
                  (rf/dispatch [:comment/add (:comment %)]))
      :error-handler #(.log js/console "Argument not posted")})))

(rf/reg-event-fx
 :debate/send!
 (fn [{:keys [db]} [_ fields]]
   (POST "/api/debate"
     {:format :json
      :headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :params fields
      :handler #(do
                  (rf/dispatch [:topic/add (:topic %)])
                  (rf/dispatch [:form/clear-fields]))
      :error-handler #(.log js/console "Argument not posted")})))

(rf/reg-sub
 :topic/loading?
 (fn [db _]
   (:topic/loading? db)))

;; (def routes
;;   ["/"
;;    ["" {:name ::home
;;         :view home}]
;;    ["topic/:topic"
;;     {:name ::topic
;;      :view topic}]
;;    ["argument/:argument"
;;     {:name ::argument
;;      :view argument}]
;;    ["my-account"
;;     {:name ::account
;;      :view my-account}]])

(def router
  (rtf/router
   (app-routes)
   {:data {:coercion reitit-spec/coercion}}))

(defn page [{{:keys [view name]} :data
             path :path}]
  [:section.section>div.container
   (if view
     [view]
     [:div "No view specified for route: " name " (" path ")"])])

(defn navbar []
  (let [burger-active (r/atom false)]
    (fn []
      [:nav.navbar.is-info
       [:div.container
        [:div.navbar-brand
         [:a.navbar-item
          {:href "/"
           :style {:font-weight "bold"}}
          "OpinionNeeded"]
         [:span.navbar-burger.burger
          {:data-target "nav-menu"
           :on-click #(swap! burger-active not)
           :class (when @burger-active "is-active")}
          [:span]
          [:span]
          [:span]]]
        [:div#nav-menu.navbar-menu
         {:class (when @burger-active "is-active")}
         [:div.navbar-start
          [:a.navbar-item
           {:href "/"}
           "Home"]]
         [:div.navbar-end
          [:div.navbar-item
           (case @(rf/subscribe [:auth/user-state])
             :loading
             [:div {:style {:width "5em"}}
              [:progress.progress.is-dark.is-small {:max 100} "30%"]]
             :authenticated
             [:div.buttons
              [auth/nameplate @(rf/subscribe [:auth/user])]
              [auth/logout-button]]
             :anonymous
             [:div.buttons
              [auth/login-button]
              [auth/register-button]])]]]]])))

(defn app []
  (let [current-route @(rf/subscribe [:router/current-route])]
    [:div.app
     [navbar]
     [:section.section>div.container
      [page current-route]]]))

(defn init-routes! []
  (rtfe/start!
   router
   (fn [new-match]
     (when new-match
       (rf/dispatch [:router/navigated new-match])))
   {:use-fragment false}))

(defn ^:dev/after-load mount-components []
  (rf/clear-subscription-cache!)
  (.log js/console "Mounting Components...")
  (init-routes!)
  (dom/render [#'app] (.getElementById js/document "content"))
  (.log js/console "Components Mounted!"))

(defn init! []
  (.log js/console "Initializing App...")
  (rf/dispatch-sync [:app/initialize])
  (mount-components))