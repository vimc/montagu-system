import * as React from "react";
import {PageArticle} from "./PageArticle";
import {PageParts} from "./PageWithHeader";

export interface PageProps {
    page: PageParts;
}

import * as logo from "./logo.png"
import {PageHeader} from "./PageHeader";

export class Page extends React.Component<PageProps, undefined> {

    render(): JSX.Element {
        const page = this.props.page;

        return <div>
            <PageHeader siteTitle={page.siteTitle()} logo={logo}/>
            <PageArticle title={page.title()} hideTitle={page.hideTitle()}>
                {this.props.children}
            </PageArticle>
        </div>
    }
}
