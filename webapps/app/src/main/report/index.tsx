import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReportingApp } from "./components/ReportingApp";
import fetcher from "../shared/sources/Fetcher";
import { ReportingFetcher } from "./sources/ReportingFetcher";
import { reportingAuthStore } from "./stores/ReportingAuthStore";

require('./index.html');
import '../shared/styles/fonts.scss';
import '../shared/styles/buttons.scss';
import '../shared/styles/common.scss';

fetcher.fetcher = new ReportingFetcher();
reportingAuthStore.loadAccessToken();

ReactDOM.render(
    <ReportingApp />,
    document.getElementById("react")
);