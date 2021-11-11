(ns opinionneeded.topics
  (:require [opinionneeded.db.core :as db]

            [next.jdbc :as jdbc]))


(defn topic-list []
  {:topics (vec (db/get-topics))})

(defn single-topic [topic-id]
  {:topic (db/get-topic {:topic_id topic-id})
   :arguments (vec (db/get-arguments-for-debate {:topic_id topic-id}))
   :comments (vec (db/get-comments-for-debate {:topic_id topic-id}))})

(defn get-comments [id]
  {:comments (vec (db/get-comments-for-debate {:topic_id id}))})

(defn get-all-by-author [{:keys [login]}]
  {:topics (db/get-topics-by-author {:author login})
   :arguments (db/get-arguments-by-author {:author login})
   :comments (db/get-comments-by-author {:author login})})


(defn save-argument! [{:keys [login]} params]
  (db/save-argument! (assoc params :author login)))

(defn save-comment! [{:keys [login]} params]
  (db/save-comment! (assoc params :author login)))

(defn save-debate! [{:keys [login]} params]
  (db/save-topic! (assoc params :author login)))

 (defn delete-argument [id]
   (db/delete-argument {:id id}))

 (defn delete-comment [id]
   (db/delete-comment {:id id}))

 (defn delete-topic [id]
     (db/delete-topic {:id id}))