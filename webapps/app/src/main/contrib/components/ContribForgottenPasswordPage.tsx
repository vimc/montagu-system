import * as React from "react";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";
import {ForgottenPasswordForm} from "../../shared/components/Login/ForgottenPasswordForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {ChooseGroupPage} from "./ChooseGroup/ChooseGroupPage";
import { Page } from "../../shared/components/PageWithHeader/Page";

const pageTitle = "Forgotten your password?";

export class ContribForgottenPasswordPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return pageTitle;
    }

    urlFragment(): string {
        return "/forgotten-password/";
    }

    parent(): IPageWithParent {
        return new ChooseGroupPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <ForgottenPasswordForm />
        </Page>;
    }
}