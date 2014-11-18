# rhqapi.js changelog

# version 0.3
 * Resource extended (calltime metircs, alert definitions)
 * added support for group operations (run, schedule)
 * added support for dynaGroups
 * added bundleGroups
 * bundles fixed to use streaming remote API when available (useful for large
 deployments)
 * suport for resource types and metric templates

# version 0.2
 * fixed: bundle deployment fails when CLI runs on different host then server
 * improved logging - added more levels, INFO (default) now notifies user 
 about important actions (creations,removals)
 * added support for roles and subjects
 * added support for scheduling resource operation
 * support for resource metrics (listing, setting interval, retrieving live 
 values)
 * changed: `Resource.invokeOperation()` now returns JS object with operation 
 status and result 

# version 0.1
* initial version
