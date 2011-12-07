# Example on doing reporting via DynamicReports

[DynamicReports][1] is a library built on top of [JasperReports][2]

* PlatformsReport - simple report to list the platforms in a tabular form. Parameters are
  _username_ _password_ [_server_]

  You can start it via `mvn exec:java` if the server is not running on localhost, you will need to
  modify the pom.xml file

[1]: http://dynamicreports.sourceforge.net/
[2]: http://www.jaspersoft.com/jasperreports