import * as React from "react";
import * as ReactDOM from "react-dom";
import { AdminApp } from "./components/AdminApp";
import fetcher from "../shared/sources/Fetcher";
import { AdminFetcher } from "./sources/AdminFetcher";
import { adminAuthStore } from "./stores/AdminAuthStore";

require('./index.html');
require('../shared/styles/fonts.css');
require('../shared/styles/buttons.css');
require('../shared/styles/common.css');

fetcher.fetcher = new AdminFetcher();
adminAuthStore.loadAccessToken();

ReactDOM.render(
    <AdminApp />,
    document.getElementById("react")
);