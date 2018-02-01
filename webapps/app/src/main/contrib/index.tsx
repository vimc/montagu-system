import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContribApp } from "./components/ContribApp";
import { ContribFetcher } from "./sources/ContribFetcher";
import fetcher from "../shared/sources/Fetcher";
import { Provider } from "react-redux";
import { createReportStore } from "./stores/createContribStore";
import { authActions } from "../shared/actions/authActions"

import './index.html';
import '../shared/styles/bootstrap.scss';
import '../shared/styles/fonts.scss';
import '../shared/styles/buttons.scss';
import '../shared/styles/common.scss';

fetcher.fetcher = new ContribFetcher();
const store = createReportStore();
store.dispatch(authActions.loadSavedToken())

ReactDOM.render(
    <Provider store={store}>
        <ContribApp />
    </Provider>,
    document.getElementById("react")
);