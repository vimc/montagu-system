import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReportingApp } from "./components/ReportingApp";
import fetcher from "../shared/sources/Fetcher";
import { ReportingFetcher } from "./sources/ReportingFetcher";
import { Provider } from "react-redux";
import { createReportStore } from "./stores/createReportStore";
import { authActions } from "../shared/actions/authActions"

import './index.html';
import './style.scss';

fetcher.fetcher = new ReportingFetcher();
const store = createReportStore();
store.dispatch(authActions.loadSavedToken());

ReactDOM.render(
    <Provider store={store}>
        <ReportingApp />
    </Provider>,
    document.getElementById("react")
);