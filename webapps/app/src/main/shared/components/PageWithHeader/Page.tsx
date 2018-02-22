import * as React from "react";
import {PageArticle} from "./PageArticle";
import {PageParts} from "./PageWithHeader";

interface PageProps {
    page: PageParts;
}

export class PageNoHeader extends React.Component<PageProps, undefined> {

    render(): JSX.Element {
        const page = this.props.page;

        return <PageArticle title={page.title()} hideTitle={page.hideTitle()}>
            {this.props.children}
        </PageArticle>
    }
}
