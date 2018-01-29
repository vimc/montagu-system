import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReportingApp } from "./components/ReportingApp";
import fetcher from "../shared/sources/Fetcher";
import { ReportingFetcher } from "./sources/ReportingFetcher";
import { Provider } from "react-redux";
import store from "./stores/Store";
import { loadToken } from "../shared/actions/_AuthActions"

import './index.html';
import '../shared/styles/bootstrap.scss';
import '../shared/styles/fonts.scss';
import '../shared/styles/buttons.scss';
import '../shared/styles/common.scss';

fetcher.fetcher = new ReportingFetcher();
store.dispatch(loadToken())

ReactDOM.render(
    <Provider store={store}>
        <ReportingApp />
    </Provider>,
    document.getElementById("react")
);