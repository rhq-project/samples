package rhq.dsl


import play.api.libs.ws.WS
import scala.concurrent.duration._
import scala.concurrent._
import scala.language.postfixOps
import scala.language.reflectiveCalls


object main extends App {

  // create an instance of alert definition (basically the json representation prepared for sending to REST backend)
  val alert1 =
    define alert having {
      name -> "foo"
      description -> "test"
      priority -> HIGH
      enabled -> true

      conditions all(
        CONFIG CHANGED,
        AVAILABILITY STAYS DOWN FOR 1 HOUR
        )
      dampening -> (2 from 4 last evaluations)
    }


  // another example of defining an alerts
  val alert2 =
    define alert having {
      name -> "bar"
      priority -> LOW
      enabled -> false

      conditions any (
        AVAILABILITY GOES DOWN
        )

      dampening -> (2 consecutive evaluations)
    }


  val alert3 =
    define alert having {
      name -> "baz"

      conditions any(
        "viewProcessList" OPERATION HAS STATUS FAILURE,
        AVAILABILITY STAYS DOWN FOR 42 MINUTES
        )
      dampening -> (in last 25 minutes 3 times)
    }


  // create the alerts on the RHQ server using POST method on REST endpoint
  val futureAlert1 = server create alert1 on resource withId 10001
  val futureAlert2 = server create alert2 on resource withId 10001
  val futureAlert3 = server withHostName("http://localhost:7080") withCredentials("rhqAdmin", "rhqAdmin") create alert3 on resource withId 10001


  // await the results if needed (using the async non-blocking http client)
//  println(Await.result(futureAlert1, 6 seconds))
//  println(Await.result(futureAlert2, 6 seconds))
//  println(Await.result(futureAlert3, 6 seconds))
  Await.result(futureAlert1, 6 seconds)
  //  println(futureAlert1.value.get.get.body)
  WS.client.close()

}



//{
//  "id":10011,
//  "name":"StorageNodeHighDiskUsage",
//  "enabled":true,
//  "priority":"MEDIUM",
//  "recoveryId":0,
//  "conditionMode":"ANY",
//  "conditions":[
//    {
//      "category":"THRESHOLD",
//      "id":10031,
//      "threshold":0.5,
//      "option":null,
//      "triggerId":null,
//      "comparator":">",
//      "measurementDefinition":11352,
//      "name":"Data File Disk Used Percentage"
//    },
//    {
//      "category":"THRESHOLD",
//      "id":10032,
//      "threshold":0.75,
//      "option":null,
//      "triggerId":null,
//      "comparator":">",
//      "measurementDefinition":11353,
//      "name":"Total Disk Used Percentage"
//    },
//    {
//      "category":"THRESHOLD",
//      "id":10033,
//      "threshold":1.5,
//      "option":null,
//      "triggerId":null,
//      "comparator":"<",
//      "measurementDefinition":11354,
//      "name":"Free Disk to Data Size Ratio"
//    }
//  ],
//  "notifications":[
//  ],
//  "dampeningCategory":"PARTIAL_COUNT",
//  "dampeningCount":10,
//  "dampeningPeriod":15,
//  "dampeningUnit":"MINUTES"
//}







//{
//  "id":10682,
//  "name":"-x-test-full-definition",
//  "enabled":false,
//  "priority":"HIGH",
//  "recoveryId":0,
//  "conditionMode":"ANY",
//  "conditions":[
//    {
//      "name":"AVAIL_GOES_DOWN",
//      "category":"AVAILABILITY",
//      "id":10242,
//      "threshold":null,
//      "option":null,
//      "triggerId":null
//    }
//  ],
//  "notifications":[
//    {
//      "id":10432,
//      "senderName":"Direct Emails",
//      "config":{
//        "emailAddress":"enoch@root.org"
//      }
//    }
//  ]
//}