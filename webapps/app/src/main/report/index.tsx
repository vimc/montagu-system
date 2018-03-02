import * as React from "react";
import * as ReactDOM from "react-dom";
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import { ReportingApp } from "./components/ReportingApp";
import fetcher from "../shared/sources/Fetcher";
import { ReportingFetcher } from "./sources/ReportingFetcher";
import { Provider } from "react-redux";
import { createReportStore } from "./stores/createReportStore";
import { authActions } from "../shared/actions/authActions"

import { ReportingRouter } from "./components/ReportingRouter";

import './index.html';
import './style.scss';

fetcher.fetcher = new ReportingFetcher();

const history = createBrowserHistory();
const store = createReportStore(history);

store.dispatch(authActions.loadSavedToken());

ReactDOM.render(
    <Provider store={store}>
        {/*<ConnectedRouter history={history}>*/}
            <ReportingApp history={history} />
        {/*</ConnectedRouter>*/}
    </Provider>,
    document.getElementById("react")
);