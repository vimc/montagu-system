const environment = require('environmentSettings');

export const settings = environment.settings;

console.log("Current settings: " + JSON.stringify(settings));