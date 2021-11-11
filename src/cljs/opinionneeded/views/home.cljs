(ns opinionneeded.views.home
  (:require [re-frame.core :as rf]
            [opinionneeded.topics :as topics]
            [opinionneeded.auth :as auth]
            [ajax.core :refer [GET POST]]))

(defn topics-list [topics]
  [:ul.topics
   (for [{:keys [timestamp description title id author upvotes]} @topics]
     ^{:key timestamp}
     [:li.topics
      [:div.box
       [:p>strong author]
       [:h4 [:a {:href (str "/topic/" id)
                 :on-click (fn []
                             (rf/dispatch [:debate/id id])
                             (rf/dispatch [:set/topic id title description upvotes timestamp]))} title]]

       [:p description]
       [:time (.toLocaleString timestamp)]]
      ])])

(defn home []
  (let [topics (rf/subscribe [:topics/list])]
    
      (rf/dispatch [:form/clear-fields])
    (fn []
      [:div.content>div.columns.is-centered>div.column.is-two-thirds
       [:div.columns>div.column
        [:div.column.is-full.drop-down
         {:on-click (fn []
                      (let [cont (.getElementById js/document "debate-form")]
                        (if (= (.. cont -style -display) "block")
                          (set! (.. cont -style -display) "none")
                          (set! (.. cont -style -display) "block"))))} "Post message"]
        
        [:div
         (case @(rf/subscribe [:auth/user-state])
           :loading
           [:div {:style {:width "5em"}}
            [:progress.progress.is-dark.is-small {:max 100} "30%"]]
           :authenticated 
           [:div#debate-form.form
            [:div.field
             [:label.label {:for :argument} "Title"]
             [:input.input
              {:name :title

               :on-change #(rf/dispatch
                            [:form/set-field-debate
                             :title
                             (.. % -target -value)])
               :value @(rf/subscribe [:form/field :title])}]]
            [:div.field
             [:label.label {:for :argument} "Description"]
             [:textarea.textarea
              {:name :argument
               :value @(rf/subscribe [:form/field :description])
               :on-change #(rf/dispatch
                            [:form/set-field-debate
                             :description
                             (.. % -target -value)])}]]
            [:input.button.is-primary
             {:type :submit
              :value "submit"
              :on-click #(rf/dispatch [:debate/send!
                                       @(rf/subscribe [:form/fields])])}]]
           :anonymous
           [:p "Log in to make a post"])]
       
        (if @(rf/subscribe [:topics/loading?])
          [:h4 "Loading topics..."]
          [topics-list topics])]])))