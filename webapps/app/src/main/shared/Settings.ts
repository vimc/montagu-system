import { settings as defaultSettings } from "./settings/default";
const environment = require('environmentSettings');
const appName = require('appName');

export const settings: Settings = Object.assign({}, defaultSettings, environment.settings);
export const appSettings: AppSpecificSettings = (settings as any)[appName.appName];

console.log("Current settings: " + JSON.stringify(settings));
console.log("API url: " + settings.apiUrl());
console.log("Current app settings: " + JSON.stringify(appSettings));