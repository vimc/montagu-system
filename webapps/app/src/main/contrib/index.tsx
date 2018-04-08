import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import {History} from "history";

import { ContribApp } from "./components/ContribApp";
import { Provider } from "react-redux";
import { createContribStore } from "./createStore";
import { authActions } from "../shared/actions/authActions"

import './index.html';
import './style.scss';

const history: History = createBrowserHistory({ basename: "/contribution"});
const store = createContribStore(history);

store.dispatch(authActions.loadSavedToken())

ReactDOM.render(
    <Provider store={store}>
        <ContribApp history={history} />
    </Provider>,
    document.getElementById("react")
);