export interface Breadcrumb {
    url: string;
    name: string;
}

export interface IPageWithParent {
    url(): string;
    urlFragment(): string;
    name(): string;
    parent(): IPageWithParent;
}