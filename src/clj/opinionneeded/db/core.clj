(ns opinionneeded.db.core
  (:require
    [next.jdbc.date-time]
   [java-time :refer [java-date]]
    [next.jdbc.result-set]
    [conman.core :as conman]
    [mount.core :refer [defstate]]
    [opinionneeded.config :refer [env]]))

(defstate ^:dynamic *db*
          :start (conman/connect! {:jdbc-url (env :database-url)})
          :stop (conman/disconnect! *db*))

(defn sql-timestamp->inst [t]
  (-> t
      (.toLocalDateTime)
      (.atZone (java.time.ZoneId/systemDefault))
      (java-date)))

(conman/bind-connection *db* "sql/queries.sql")

(extend-protocol next.jdbc.result-set/ReadableColumn
  java.sql.Timestamp
  (read-column-by-label [^java.sql.Timestamp v _]
    (sql-timestamp->inst v))
  (read-column-by-index [^java.sql.Timestamp v _2 _3]
    (sql-timestamp->inst v))
  java.sql.Date
  (read-column-by-label [^java.sql.Date v _]
    (.toLocalDate v))
  (read-column-by-index [^java.sql.Date v _2 _3]
    (.toLocalDate v))
  java.sql.Time
  (read-column-by-label [^java.sql.Time v _]
    (.toLocalTime v))
  (read-column-by-index [^java.sql.Time v _2 _3]
    (.toLocalTime v)))
