import * as React from "react";
import {ReportingPageHeader} from "./ReportingPageHeader";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {PageProps} from "../../shared/components/PageWithHeader/Page";

export class ReportingPage extends React.Component<PageProps, undefined> {

    render() :JSX.Element {
        const page = this.props.page;
        return <div>
            <ReportingPageHeader />
            <PageArticle title={page.title()} hideTitle={page.hideTitle()}>
                { this.props.children }
            </PageArticle>
        </div>;
    }
}
