package rhq

package object dsl {
  object define {
    var props = scala.collection.mutable.Map.empty[String, Any]
    def alert(alertBuilder: AlertBuilder): Alert = {
      alertBuilder.finish.getOrElse(
        throw new IllegalStateException("can't build incomplete Alert")
      )
    }
  }

  abstract class AlertBuilder {
    def finish: Option[Alert] = {
      try {
        if (!define.props.contains("name") || define.props("name").toString.isEmpty) None
        Some(Alert(define.props.toMap))
      } finally {
        define.props = scala.collection.mutable.Map.empty[String, Any]
      }
    }
  }

  object having extends AlertBuilder {
    def apply(alertBuilder: AlertBuilder): AlertBuilder = this
  }

  object description extends AlertBuilder {
    def ->(value: String): AlertBuilder = {
//      define.props += (("description", value))
      this
    }
  }

  class Priority(val str: String) {
    override def toString = str
  }

  object MEDIUM extends Priority("MEDIUM")
  object LOW extends Priority("LOW")
  object HIGH extends Priority("HIGH")

  object priority extends AlertBuilder {
    def ->(value: Priority): AlertBuilder = {
      define.props += (("priority", value.toString))
      this
    }
  }

  object enabled extends AlertBuilder {
    def ->(value: Boolean): AlertBuilder = {
      define.props += (("enabled", value))
      this
    }
  }

  object name extends AlertBuilder {
    def ->(value: String): AlertBuilder = {
      define.props += (("name", value))
      this
    }
  }

  /**
   * conditions stuff
   */
  class ConditionsBuilder extends AlertBuilder
  object conditions extends ConditionsBuilder {

    def any(list: Map[String, Any]*): ConditionsBuilder = {
      define.props += ("conditionMode" -> "ANY")
      define.props += ("conditions" -> list.toList)
      this
    }

    def all(list: Map[String, Any]*): ConditionsBuilder = {
      define.props += ("conditionMode" -> "ALL")
      define.props += ("conditions" -> list.toList)
      this
    }
  }

  object in {
    def last(x: Int) = new {
      private[this] def xy(y: Int, units: String) =
        new {
          def times = {
            define.props += ("dampeningCategory" -> "DURATION_COUNT")
            define.props += ("dampeningCount" -> x)
            define.props += ("dampeningPeriod" -> y)
            define.props += ("dampeningUnit" -> units)
            new DampeningBuilderDone
          }
        }
      def minutes(y: Int) = xy(y, "MINUTES")
      def hours(y: Int) = xy(y, "HOURS")
      def hour = hours _
      def minute = minutes _
    }
  }


  /**
   * dampening stuff
   */
  class DampeningBuilderDone
  class DampeningBuilderEvaluationsProgress
  object evaluations extends DampeningBuilderEvaluationsProgress

  case class IntWrapper(value: Int) {
    def consecutive(foo: DampeningBuilderEvaluationsProgress) = {
      define.props += ("dampeningCategory" -> "CONSECUTIVE_COUNT")
      define.props += ("dampeningCount" -> value)
      new DampeningBuilderDone
    }

    def from(y: Int) = {
      new {
        def last(foo: DampeningBuilderEvaluationsProgress) = {
          define.props += ("dampeningCategory" -> "PARTIAL_COUNT")
          define.props += ("dampeningCount" -> value)
          define.props += ("dampeningPeriod" -> y)
          new DampeningBuilderDone
        }
      }
    }
  }

  object dampening extends AlertBuilder {
    def ->(value: DampeningBuilderDone) = this
  }

  /**
   * Availability stuff
   */
  object AVAILABILITY {
    def STAYS(state: AvailabilityDurationState) = new {
      def FOR(duration: Int) = new {
        private[this] def X(dur: Int) = Map[String, Any](
          "name" -> s"AVAIL_DURATION_$state",
          "category" -> "AVAIL_DURATION",
          "option" -> dur.toString
        )
        def MINUTES = X(duration * 60)
        def HOURS = X(duration * 60 * 60)
        def HOUR = HOURS
        def MINUTE = MINUTES
      }
    }

    def GOES(state: AvailabilityState) = Map[String, Any](
      "name" -> s"AVAIL_GOES_$state",
      "category" -> "AVAILABILITY"
    )
  }

  object CONFIG {
    def CHANGED = Map[String, Any](
      "category" -> "RESOURCE_CONFIG"
    )
  }

  class AvailabilityState(val str: String) {
    override def toString = str
  }
  object UP extends AvailabilityState("UP")
  object NOT_UP extends AvailabilityState("NOT_UP") with AvailabilityDurationState
  object DISABLED extends AvailabilityState("DISABLED")
  object DOWN extends AvailabilityState("DOWN") with AvailabilityDurationState
  object UNKNOWN extends AvailabilityState("UNKNOWN")

  trait AvailabilityDurationState
  case class ConditionStringWrapper(val op: String) {
    def OPERATION(foo: ConditonOperationHasBuilder) = new {
      def STATUS(status: OperationStatus) = Map[String, Any](
        "name" -> op,
        "category" -> "CONTROL",
        "option" -> status.toString
      )
    }
  }

  class OperationStatus(val str: String) {
    override def toString = str
  }
  object CANCELED extends OperationStatus("CANCELED")
  object FAILURE extends OperationStatus("FAILURE")
  object INPROGRESS extends OperationStatus("INPROGRESS")
  object RUNNING extends OperationStatus("RUNNING")

  class ConditonOperationHasBuilder
  object HAS extends ConditonOperationHasBuilder

  /**
   * json utils
   */
  object jsonSerializer {
    import play.api.libs.json._
    import play.api.libs.json.Reads._
    import play.api.libs.json.Json.JsValueWrapper

    implicit val objectMapFormat = new Format[Map[String, Any]] {

      def writes(map: Map[String, Any]): JsValue = {
        def writes0(any: Any): JsValue = {
          any match {
            case _: String | _: Boolean => JsString(any.toString)
            case int: Int => JsNumber(int)
            case mp: Map[_, _] => writes(mp.asInstanceOf[Map[String, Any]])
            case (foo, bar) => JsArray(List(writes0(foo), writes0(bar)))
            case (foo, bar, baz) => JsArray(List(writes0(foo), writes0(bar), writes0(baz)))
            case arr: Seq[Any] => JsArray(arr.map(writes0(_)))
            case _ => JsString(any.getClass.toString)
          }
        }
        Json.obj(map.map {
          case (s, o) =>
            val ret: (String, JsValueWrapper) = s -> writes0(o)
            ret
          }.toSeq: _*
        )
      }


      def reads(jv: JsValue): JsResult[Map[String, Any]] =
        JsSuccess(jv.as[Map[String, JsValue]].map{case (k, v) =>
          k -> (v match {
            case s: JsString => s.as[String]
            case l => l.as[List[String]]
          })
        })
    }
  }

  /**
   * implicit conversions
   */
  import scala.language.implicitConversions
  implicit def int2Foo(value: Int) = new IntWrapper(value)
  implicit def string2ConditionStringWrapper(value: String) = new ConditionStringWrapper(value)


  class Alert(val json: String)
  object Alert {
    def apply(fields: Map[String, Any]): Alert = {
      import play.api.libs.json.Json
      import jsonSerializer._
      val json = Json.toJson(fields)
      new Alert(Json.prettyPrint(json))
//      new Alert(Json.stringify(json))
    }

    //https://github.com/RedHatQE/jon-tests/blob/master/alerts/rhq/conditions.py
    //https://github.com/RedHatQE/jon-tests/blob/master/alerts/rhq/server.py#L177
  }

  object resource extends !@#@
  object server extends Ser
  class !@#@
  case class Ser(val url: String = "http://localhost:7080", val user: String = "rhqadmin", val password: String = "rhqadmin") {
    def withHostName(url: String) = new Ser(url, user, password)
    def withCredentials(user: String, password: String) = new Ser(url, user, password)

    def create(alert: Alert) = {
      new {
        def on(foo: !@#@) = new {
           def withId(id: Int) = {
             import scala.concurrent.duration._
             import scala.language.postfixOps
             import play.api.libs.ws.WS
             import com.ning.http.client.Realm.AuthScheme

             val urlWithAuth = WS.url(url + "/rest/alert/definitions?resourceId=" + id).withAuth(user, password, AuthScheme.BASIC).
               withHeaders("Content-Type" -> "application/json").withRequestTimeout((5 seconds).toMillis.toInt)
             println("\n\njson:\n" + alert.json)
             urlWithAuth.post(alert.json)
           }
        }
      }

    }
  }
}
