import * as React from "react";

interface ArticleProps {
    title: JSX.Element | string;
    hideTitle?: boolean;
    children: any;
}

const PageArticle: React.SFC<ArticleProps> = (props: ArticleProps) => {
    return <article className="page container">
        { !props.hideTitle &&
        <div className="page__title">{ props.title }</div>
        }
        <div className="page__content">{ props.children }</div>
    </article>;
}

PageArticle.defaultProps = {
    hideTitle: false
} as Partial<ArticleProps> ;

export { PageArticle };
