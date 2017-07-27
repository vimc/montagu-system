import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContribApp } from "./components/ContribApp";
import { ContribFetcher } from "./sources/ContribFetcher";
import fetcher from "../shared/sources/Fetcher";
import { contribAuthStore } from "./stores/ContribAuthStore";

require('./index.html');
require('../shared/styles/fonts.css');
require('../shared/styles/buttons.css');
require('../shared/styles/common.css');

fetcher.fetcher = new ContribFetcher();
contribAuthStore.loadAccessToken();

ReactDOM.render(
    <ContribApp />,
    document.getElementById("react")
);