# immutant-demo

This is a small demo application that uses [cl-rhq-rest](https://github.com/rhq-project/samples/tree/master/rest-api/clojure/clj-rhq-rest) and runs on [Immutant](http://immutant.org/). The application deploys a scheduled job that runs at fixed intervals, and queries for raw data for a number of resources/measurement schedules. 

## Usage

First follow the instructions to build [cl-rhq-rest](https://github.com/rhq-project/samples/tree/master/rest-api/clojure/clj-rhq-rest).

Then follow the instructions to [install Immutant](http://immutant.org/install/). 

From a shell run,

```
$ lein immutant deploy
$ lein immutant run
```

And that's it!

#### Additional Notes
The schedule ids for which raw data is queried is currently hard coded. To change the schedule ids, open `src/immutant/init.clj` and edit this var,

```clj
(def schedule-ids
  [10001 10078 10080 10094
  10017 10590 10013 10460
  12711 10028 10892 10024])
```