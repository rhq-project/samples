# clj-rhq-rest

This is an RHQ REST client that currently provides a a handful of functions. Most notably, it provides an easy way to pull raw metric data.

## Usage

In order to use this library, you should clone this repo, and you will have to build this project from source. You need to have [leiningen](https://github.com/technomancy/leiningen) installed in order to build. 

#### Install into local Maven repo
`$ lein install`

#### Fire up and run from REPL
`$ lein repl`

```clj
(require '[rhq.rest.client :as rhq])

; fetch the platform 
(rhq/get-resource 10001)

; fetch measurement schedules
(rhq/get-schedules 10001)

; fetch only numeric measurement schedules
(rhq/get-schedules 10001 :numeric)

; pull raw data for a particular schedule
(rhq/get-raw-data (second (rhq/get-schedules 10001 :numeric)))
```
#### Additional Notes
`client.clj` currently has the server endpoint hard coded as localhost. You will need to change the following line if you want to use a different address:

```clj
(def server-url "http://localhost:7080/rest/")
```
