import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import {History} from "history";

import { ReportingApp } from "./components/ReportingApp";
import { Provider } from "react-redux";
import { createReportStore } from "./stores/createReportStore";
import { authActionCreators } from "../shared/actions/authActionCreators"

import './index.html';
import './style.scss';

const history: History = createBrowserHistory({ basename: "/reports"});
const store = createReportStore(history);

store.dispatch(authActionCreators.loadSavedToken());

ReactDOM.render(
    <Provider store={store}>
        <ReportingApp history={history} />
    </Provider>,
    document.getElementById("react")
);