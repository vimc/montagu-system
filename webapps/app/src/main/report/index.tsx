import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import {History} from "history";

import { ReportingApp } from "./components/ReportingApp";
import fetcher from "../shared/sources/Fetcher";
import { ReportingFetcher } from "./sources/ReportingFetcher";
import { Provider } from "react-redux";
import { createReportStore } from "./stores/createReportStore";
import { authActionCreators } from "../shared/actions/authActionCreators"

import './index.html';
import './style.scss';

fetcher.fetcher = new ReportingFetcher();

const history: History = createBrowserHistory({ basename: "/reports"});
const store = createReportStore(history);

store.dispatch(authActionCreators.loadSavedToken());

ReactDOM.render(
    <Provider store={store}>
        <ReportingApp history={history} />
    </Provider>,
    document.getElementById("react")
);