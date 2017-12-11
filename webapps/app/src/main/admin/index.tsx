import * as React from "react";
import * as ReactDOM from "react-dom";
import { AdminApp } from "./components/AdminApp";
import fetcher from "../shared/sources/Fetcher";
import { AdminFetcher } from "./sources/AdminFetcher";
import { adminAuthStore } from "./stores/AdminAuthStore";

require('./index.html');
require('../shared/styles/fonts.scss');
import '../shared/styles/buttons.scss';
import '../shared/styles/common.scss';

fetcher.fetcher = new AdminFetcher();
adminAuthStore.loadAccessToken();

ReactDOM.render(
    <AdminApp />,
    document.getElementById("react")
);