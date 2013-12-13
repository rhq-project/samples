(ns rhq.rest.client
  (:require [clojure.data.json :as json])
  (:require [clj-http.client :as http]))

(def server-url "http://localhost:7080/rest/")

(def schedule-types
  {:trait "TRAIT"
   :numeric "MEASUREMENT"})

(defn get-json
  ([url] (http/get url {:basic-auth ["rhqadmin" "rhqadmin"]
                        :accept :json
                        :as :json}))
  ([url req] (http/get url (merge
                            {:basic-auth ["rhqadmin" "rhqadmin"]
                             :accept :json
                             :as :json}
                            req))))

(defn get-resource [id] (get-json (str server-url "resource/" id)))

(defn get-schedules
  ([rid]
   (:body (get-json (str server-url "resource/" rid "/schedules"))))
  ([rid schedule-type]
   (filter #(= (schedule-type schedule-types) (:type %))
           (get-schedules rid))))

(defn- get-raw-data-url [schedule]
  (:href (:metric-raw (second (:links schedule)))))

(defn get-raw-data
  ([schedule] (get-json (get-raw-data-url schedule)))
  ([schedule start]
   (get-json (get-raw-data-url schedule)
             {:query-params {"startTime" start}}))
  ([schedule start end]
   (get-json (get-raw-data-url schedule)
             {:query-params {"startTime" start
                             "endTime" end}})))
