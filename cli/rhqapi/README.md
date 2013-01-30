
# rhqapi.js 

rhqapi.js is a javascript library written on top for standard RHQ java remote
API and can be used within your scripts.

Contributed by Libor Zoubek & Filip Brychta

# Key features:
 * it's synchronous - operation calls, resource configuration updates, resource
 additions/removals are synchronous - library does waiting for you
 * javascript-friendly - library tries to abstract you from RHQ domain objects
 by representing every possible object as javascript object or function

# What can be achieved using this library?
 * easy way to locate your resource within inventory (see `examples/resources.js`)
 * retrieve/update configuration for resource
 * run or schedule resource operations (see `examples/resourceOperations.js`)
 * create child resources
 * check resource metrics (see `examples/resourceMetrics.js`)
 * delete or uninventory resource
 * create resource groups (MIXED and COMPATIBLE) (see `examples/groups.js`)
 * upload/deploy bundles (see `examples/bundles.js`)
 * create users and roles (see `examples/roles.js`)
 
See [generated JSDoc] (http://lzoubek.github.com/samples/rhqapi/) for more details.

# How to consume this library

If using RHQ 4.5.0 and higher, you can load it using commonjs. Copy
`rhqapi.js` to `$RHQ_CLI_HOME/samples/modules` and then load it following way:
```
// no need to include .js extension
var rhqapi = require("modules:/rhqapi");
```
For more information about loading commonjs modules see [documentation](https://docs.jboss.org/author/display/RHQ/Script+Sources).

For versions prior 4.5.0 you need to workaround this either by joining your
javascripts together or when using interactive mode, use:
```
exec -f /absolute/path/to/rhqapi.js
```
