(ns opinionneeded.views.argument
  (:require [re-frame.core :as rf]
            [opinionneeded.topics :as topics]
            [opinionneeded.auth :as auth]
            [ajax.core :refer [GET POST]]))

(defn argument []
  (let [debate-comments (rf/subscribe [:debate/comments])
        debate-id @(rf/subscribe [:debate/id?])
        id @(rf/subscribe [:argument/id?])]
      (rf/dispatch [:form/clear-fields])
    (fn []
      [:div
       [:div
        [:a {:href "#"
             :on-click (fn [] (.back js/window.history))} "Back"]]
       [:p "Comments"]
       [:div.column.is-full.drop-down
        {:on-click (fn []
                     (let [cont (.getElementById js/document "comment-form")]
                       (if (= (.. cont -style -display) "block")
                         (set! (.. cont -style -display) "none")
                         (set! (.. cont -style -display) "block"))))} "Post Comment"]
       (case @(rf/subscribe [:auth/user-state])
         :loading
         [:div {:style {:width "5em"}}
          [:progress.progress.is-dark.is-small {:max 100} "30%"]]
         :authenticated
         [:div#comment-form.form
          [:div.field
           [:label.label {:for :argument} "Post"]
           [:textarea.textarea
            {:name :argument
             :value  @(rf/subscribe [:form/field :comment])
             :on-change #(rf/dispatch
                          [:form/set-field-comment
                           debate-id
                           id
                           (.. % -target -value)])}]]
          [:input.button.is-primary
           {:type :submit
            :value "submit"
            :on-click #(rf/dispatch [:comment/send!
                                     @(rf/subscribe [:form/fields])])}]]
         :anonymous
         [:div
          [:p "Log in to post a comment"]])
       [:ul.comments
        (for [{:keys [comment upvotes argument_id author]} @debate-comments]

          (when (= argument_id id)
            [:li.comment
             [:div.box
              ;[:p argument_id]
              [:p>strong author]
              [:p comment]]]))]])))