import * as React from "react";
import * as ReactDOM from "react-dom";
import { AdminApp } from "./components/AdminApp";
import fetcher from "../shared/sources/Fetcher";
import { AdminFetcher } from "./sources/AdminFetcher";
import { Provider } from "react-redux";
import { createAdminStore } from "./stores/createAdminStore";
import { authActions } from "../shared/actions/AuthActions"


import './index.html';
import '../shared/styles/bootstrap.scss';
import '../shared/styles/fonts.scss';
import '../shared/styles/buttons.scss';
import '../shared/styles/common.scss';

fetcher.fetcher = new AdminFetcher();
const store = createAdminStore();
store.dispatch(authActions.loadSavedToken())

ReactDOM.render(
    <Provider store={store}>
        <AdminApp />
    </Provider>,
    document.getElementById("react")
);