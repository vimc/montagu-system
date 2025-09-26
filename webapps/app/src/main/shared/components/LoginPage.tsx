import {PageArticle} from "./PageWithHeader/PageArticle";
import * as React from "react";
import {LoadingElement} from "../partials/LoadingElement/LoadingElement";
import {loginPageActionCreators} from "../actions/LoginPageActionCreators";
import {Page} from "./Page";

export const LoginPageComponent = () => {
    return <PageArticle><LoadingElement/></PageArticle>
};

export const LoginPage = Page(loginPageActionCreators)(LoginPageComponent);
