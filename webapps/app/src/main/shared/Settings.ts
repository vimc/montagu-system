const environment = require('environmentSettings');
const appName = require('appName');

export const settings: Settings = environment.settings;
export const appSettings: AppSpecificSettings = (settings as any)[appName.appName];

console.log("Current settings: " + JSON.stringify(settings));
console.log("Current app settings: " + JSON.stringify(appSettings));