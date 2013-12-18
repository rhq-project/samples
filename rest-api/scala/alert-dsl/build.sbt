name := "rhq-alerts-dsl"

scalaVersion :="2.10.2"

version :="0.1"

mainClass in (Compile, run) := Some("rhq.dsl.main")

//libraryDependencies += "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.1.3"

//libraryDependencies += "org.apache.httpcomponents" % "httpclient" % "4.1.2"

//libraryDependencies += "com.sun.jersey" % "jersey-client" % "1.16"

libraryDependencies += "com.typesafe.play" % "play_2.10" % "2.2.1"

scalacOptions ++= Seq("-unchecked", "-deprecation", "-feature")

