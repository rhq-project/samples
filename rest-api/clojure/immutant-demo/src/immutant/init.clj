(ns immutant.init
  (:use immutant-demo.core)
  (:require [immutant.jobs :as jobs]
            [rhq.rest.client :as rhq]
            [clojure.tools.logging :as logging]))

(def schedule-ids
  [10001 10078 10080 10094
  10017 10590 10013 10460
  12711 10028 10892 10024])

(defn get-resource [id]
  (:resourceName (:body (rhq/get-resource id))))

(defn fetch-raw-data [rid]
  (let [schedules (rhq/get-schedules rid :numeric)]
    (doseq [schedule schedules] (rhq/get-raw-data schedule))
    (count schedules)))

(jobs/schedule "pull-raw-data"
               #(doseq [id schedule-ids]
                  (logging/info "Fetching raw data for resource id " id)
                  (logging/info "Fetched raw data for "
                                (fetch-raw-data id) " schedules"))
               "0 0/5 * 1/1 * ? *")
