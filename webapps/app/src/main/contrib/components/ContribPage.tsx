import * as React from "react";
import {ReportingPageHeader} from "./ReportingPageHeader";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

export class Page extends React.Component<PageProps, undefined> {

    render() :JSX.Element {
        const page = this.props.page;
        return <div>
            <ReportingPageHeader siteTitle={page.siteTitle()} />
            <PageArticle title={page.title()} hideTitle={page.hideTitle()}>
                { this.props.children }
            </PageArticle>
        </div>;
    }
}
