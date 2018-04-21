import * as React from "react";

export interface PageArticleProps {
    title?: JSX.Element | string;
    hideTitle?: boolean;
    children: any;
}

const PageArticle: React.SFC<PageArticleProps> = (props: PageArticleProps) => {
    return <article className="page container">
        { !props.hideTitle &&
        <div className="page__title">{ props.title }</div>
        }
        <div className="page__content">{ props.children }</div>
    </article>;
}

PageArticle.defaultProps = {
    hideTitle: false
} as Partial<PageArticleProps> ;

export { PageArticle };
