import * as React from "react";

export interface PageArticleProps {
    title?: JSX.Element | string;
    hideTitle?: boolean;
    children: any;
    isFluid?: boolean;
}

const PageArticle: React.FunctionComponent<PageArticleProps> = (props: PageArticleProps) => {
    return <article className={"page " + (props.isFluid ? "container-fluid container-fit" : "container")}>
        { !props.hideTitle &&
        <div className="page__title">{ props.title }</div>
        }
        <div className="page__content">{ props.children }</div>
    </article>;
};

PageArticle.defaultProps = {
    hideTitle: false
} as Partial<PageArticleProps> ;

export { PageArticle };
