import * as React from "react";

interface ArticleProps {
    title: JSX.Element | string;
    hideTitle?: boolean;
    children: any;
}

export class PageArticle extends React.Component<ArticleProps, undefined> {

    public static defaultProps: Partial<ArticleProps> = {
        hideTitle: false
    };

    render() {
        return <article className="page container">
            { !this.props.hideTitle &&
            <div className="page__title">{ this.props.title }</div>
            }
            <div className="page__content">{ this.props.children }</div>
        </article>
    }
}