const atob = require("atob");
const btoa = require("btoa");
const MockBrowser = require('mock-browser').mocks.MockBrowser;

const mock = new MockBrowser();
global.window = mock.getWindow();
global.document = mock.getDocument();
global.navigator = mock.getNavigator();
global.location = mock.getLocation();
global.history = mock.getHistory();

global.atob = atob;
global.btoa = btoa;