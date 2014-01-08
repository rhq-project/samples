/*
 * This example shows what you can do with metric templates using rhqapi.js
 * Metric templates allows to setup collecting metrics on resource type level
 * thus applying to all resources of given type
 */

var rhqapi = require("modules:/rhqapi");

// we can additionally select affected metrics using predicates
var predicates = rhqapi.metricTemplates.predicates

// lets lookup resource types first
platformTypes = rhqapi.resourceTypes.find({plugin:"Platforms"});

// set collection interval to 90s for all numeric metrics on all platform resource types
metricsTemplates.setCollectionInterval(platformTypes,90, predicates.isNumeric);
// disable all traits on platform resource types
metricsTemplates.disable(platformTypes,predicates.isTrait);

// enable all calltimes metrics on all resource types
metricTemplates.enable(rhqapi.resourceTypes.find(),predicates.isCallTime)

