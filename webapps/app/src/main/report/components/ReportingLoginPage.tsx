import * as React from "react";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import { LoginForm } from "../../shared/components/Login/LoginForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {Page} from "../../shared/components/PageWithHeader/Page";
import {ReportingPage} from "./ReportingPage";

export class ReportingLoginPage extends ReportingPageWithHeader<undefined> {
    name(): string {
        return "Log in";
    }

    includeInBreadcrumbs(): boolean {
        return false;
    }

    urlFragment(): string {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render(): JSX.Element {
        return <ReportingPage page={this}>
            <LoginForm />
        </ReportingPage>;
    }
}