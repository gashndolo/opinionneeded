(ns opinionneeded.views.topic
  (:require [re-frame.core :as rf]
            [opinionneeded.topics :as topics]
            [opinionneeded.auth :as auth]
            [ajax.core :refer [GET POST]]))

(defn arguments-component [list-of-args]
  [:ul.arguments
   (for [{:keys [comment upvotes id author]} @list-of-args]
     ;^{:key id}
     [:li.comment
      [:div.box
       [:p>strong author]
       [:p comment]
       [:p upvotes]
       ;[:p id]
       [:h4 [:a {:href (str "/argument/" id)
                 :on-click #(rf/dispatch [:argument/id id])} "comments"]]]])])

(defn topic []
  (let [debate-topic @(rf/subscribe [:debate/topic])
        debate-affirmatives (rf/subscribe [:debate/affirmatives])
        debate-negatives (rf/subscribe [:debate/negatives])
        debate-id @(rf/subscribe [:debate/id?])]
    
      (rf/dispatch [:form/clear-field-position])
    (fn []
        [:div
         [:a {:href "/"} "back"]
         [:div
          [:div.column.is-full.drop-down
           {:on-click (fn []
                        (let [cont (.getElementById js/document "form")]
                          (if (= (.. cont -style -display) "block")
                            (set! (.. cont -style -display) "none")
                            (set! (.. cont -style -display) "block"))))} "Post comment"]
          (case @(rf/subscribe [:auth/user-state])
            :loading
            [:div {:style {:width "5em"}}
             [:progress.progress.is-dark.is-small {:max 100} "30%"]]
            :authenticated
            [:div#form.form
             [:div.form-group
              [:label "Position"]
              [:select.form-control {:field :list
                                     :id :many.options
                                     :on-change #(rf/dispatch
                                                  [:form/set-field-position
                                                   (.. % -target -value)])}
               [:option {:key :affirmative} "Agree"]
               [:option {:key :negative} "Disagree"]]]
             [:div.field
              [:label.label {:for :argument} "Comment"]
              [:textarea.textarea
               {:name :argument
                :value @(rf/subscribe [:form/field :comment])
                :on-change #(rf/dispatch
                             [:form/set-field
                              debate-id
                              (.. % -target -value)
                              (.-value (.getElementById js/document "many.options"))])}]]
             [:input.button.is-primary
              {:type :submit
               :value "submit"
               :on-click #(rf/dispatch [:argument/send!
                                        @(rf/subscribe [:form/fields])])}]]
            :anonymous
            [:div
             [:p "Please log in to add a post"]])]
         [:div.box
          [:h2 (get debate-topic :title)]
          [:br]
          [:p (get debate-topic :description)]]
         [:div.columns
          [:div.column.is-half
           [:p.arg-header "Agree"]
           [arguments-component debate-affirmatives]]
          [:div.column.is-half
           [:p.arg-header "Disagree"]
           [arguments-component debate-negatives]]]])))