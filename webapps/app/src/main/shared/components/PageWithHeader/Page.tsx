import * as React from "react";
import { PageHeader } from "./PageHeader";
import { PageArticle } from "./PageArticle";
import { PageWithHeader, PageProperties } from "../../../shared/components/PageWithHeader/PageWithHeader";

interface PageProps {
    page: PageWithHeader<any>;
}

export class Page extends React.Component<PageProps, undefined> {

    render() :JSX.Element {
        const page = this.props.page;
        return <div>
            <PageHeader siteTitle={page.siteTitle()} header={ page.header() } postHeader={page.postHeader()} />
            <PageArticle title={page.title()} hideTitle={page.hideTitle()} >
                { this.props.children }
            </PageArticle>
         </div>
    }
}